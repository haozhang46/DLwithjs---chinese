# 6.2 使用tf.data管理数据
如果您的电子邮件数据库是数百GB，并且需要特殊凭据才能访问，您将如何训练垃圾邮件过滤器？如果训练图像的数据库太大，无法在一台机器上容纳，如何构造图像分类器？

访问和操作大量数据是机器学习工程师的一项关键技能，但到目前为止，我们一直在处理那些可用内存的数据。许多应用程序需要处理大型、繁琐且可能对隐私敏感的数据源，而这种技术不适合这些数据源。大型应用程序需要从远程按需访问数据的技术。

TensorFlow.js附带了一个集成库，专门为这种数据管理而设计。受TensorFlow的Python版本tf.data API的启发，它的构建使用户能够以简洁易读的方式接收、预处理和路由数据。假设您的代码使用如下import语句导入TensorFlow.js：
 ```js
import * as tf from '@tensorflow/tfjs';
```
此功能将在命名空间下tf.data可用。

## 6.2.1 tf.data.Dataset对象
大多数与tfjs数据的交互都是通过一个名为Dataset的对象类型进行的。这个tf.data.Dataset对象提供了一种简单的、可配置的、可执行的方式来遍历和处理数据元素的大列表（可能是无限的）。在最粗略的抽象中，可以将数据集想象为任意元素的可重复的集合，这与Node.js中的流相似。每当从数据集请求下一个元素时，内部实现将根据需要下载、访问或执行函数来创建它。这种抽象使得模型可以很容易地训练更多的数据，而这些数据不可能同时保存在内存中。当有多个数据集要跟踪时，它还方便了将数据集作为一级对象进行共享和组织。

数据集只对所需的数据位进行流式处理，而不是以单一方式访问整个数据位，从而提供内存优势。数据集API还通过预取即将需要的值，对原始实现提供性能优化。
## 6.2.2创建tf.data.Dataset
从tfjs版本1.2.7开始，有三种方法可以通过tf.data.Dataset连接到某些数据提供源。我们将对每一个进行一些详细的讨论，但是表6.1包含了一个简短的总结。
###### 表6.1从数据源创建tf.data.Dataset对象。
|如何获取新的 tf.data.Dataset|API|如何建数据集|
|--|--|--|
|来自js的元素数组，Float32Array 类型数组|const dataset = tf.data.array([1,2,3,4,5])；详见清单6.1.|
|每一行都是元素的csv文件（可以是远程csv文件）| tf.data.csv( source, csvConfig)| const dataset = tf.data.csv("https://path/to/my.csv");详见清单6.2.|
|来自可yield元素的generator方法| tf.data.generator（generatorFunction)| function* countDownFrom10() { for (let i=10; i>0; i--) {yield(i);}}const dataset = tf.data.generator(countDownFrom10); 详见清单6.3|
#### 从数组创建tf.data.Dataset
构建一个新的tf.data.Dataset最简单的方法是构建一个新的JavaScript元素数组。给定一个已经在内存中的数组，可以使用函数 tf.data.array()创建一个数据集。当然，与直接使用数组相比，它不会带来任何训练速度或内存使用的优势，但是通过数据集访问数组提供了其他重要的好处。例如，使用数据集可以更容易地设置预处理，并通过简单的model.fitDataset 和model.evaluateDataset 的API使我们的训练和评估更容易，如下面6.3节所示。与之相反，model.fit(x, y), model.fitDataset(myDataset)不会立即将所有数据移动到GPU内存中。考虑到V8 JavaScript引擎的内存限制（64位系统上为1.4gb）通常大于TensorFlow.js在WebGL的内存限制。使用tf.data API也是一个很好的软件工程实践，因为它使以模块化的方式交换另一种类型的数据变得很容易，而不需要更改很多代码。如果没有Dataset，很容易让数据集实现的细节泄漏到模型的训练中，一旦使用不同的实现，就需要解决相应的问题。

从现有数组构建数据集，请使用tf.data.array(itemsAsArray)。如清单6.1所示。
###### 清单6.1从数组构建tf.data.Dataset
```js
const myArray = [{xs: [1, 0, 9], ys: 10},
                    {xs: [5, 1, 3], ys: 11},
                    {xs: [1, 1, 9], ys: 12}];
   const myFirstDataset = tf.data.array(myArray);
   await myFirstDataset.forEachAsync(e => console.log(e));
```
我们使用forEachAsync()函数遍历数据集的元素，依次生成每个元素。请参阅第6.2.3节中有关该Dataset.forEachAsync功能的更多详细信息。

Datasets的元素可以包含JavaScript原始类型[96]（例如数字和字符串）以及此类结构的元组、数组和嵌套对象。在这个小例子中，三个元素都有相同的结构。它们都是具有相同键和相同类型值的对象。一般来说 tf.data.Dataset可以支持元素类型的混合，但常见的用例是元素是相同类型的语义单元，它们代表同类事物。因此，除了不寻常的用例，每个元素都应该具有相同的类型和结构。

#### 从CSV文件创建tf.data.Dataset
数据集元素的一种非常常见的类型是表示表的一行（如CSV文件的一行）的键值对象。清单6.2显示了一个非常简单的程序，它列出了波士顿住房数据集，这是我们在第2章中首先使用的数据集。
###### 清单6.2从CSV文件构建tf.data.Dataset
```js
const myURL =
       "https://storage.googleapis.com/tfjs-examples/multivariate-linear-regression/data/train-data.csv";
   const myCSVDataset = tf.data.csv(myURL);
   await myCSVDataset.forEachAsync(e => console.log(e));
```
 
这里我们使用tf.data.csv而不是tf.data.array，并指向csv文件的URL。这将创建一个由CSV文件支持的数据集，在该数据集上，将在CSVs行上迭代。在Node.js中，我们可以使用前缀为“file://”的URL句柄连接到本地csv文件，如下所示：
 
 ```js
const data = tf.data.csv('file://./relative/fs/path/to/boston-housing-train.csv');

```
迭代时，我们看到每个CSV行都转换为JS对象。每个CSV列有一个属性，这些属性根据CSV文件中的列名命名。这便于与元素交互，因为不再需要记住字段的顺序。第6.4.1节将更详细地描述如何使用CSV。
#### 从生成器函数创建tf.data.Dataset
第三种，也是最灵活的创建方法是从生成器函数构建一个数据集。这是通过使用tf.data.generator()方法完成的。以JavaScript的生成器函数（也称为function*）[97]作为参数。如果您不熟悉生成器函数（这些函数对JavaScript来说相对较新），您可能需要花点时间阅读它们的文档。生成器函数的目的是根据需要“产生”一系列值，无论是永久的还是暂时的。从生成器函数生成的值将成为数据集的值。例如，一个非常简单的生成器函数可能产生随机数，或者从连接的硬件中提取数据快照。一个复杂的生成器可以与视频游戏集成，产生屏幕截图、分数和控制输入/输出。在下面的代码清单6.3中，非常简单的生成器函数生成骰子卷的样本。
###### 清单6.3为随机掷骰子建立tf.data.Dataset
```js
let numPlaysSoFar = 0;
  
   function rollTwoDice() {
     numPlaysSoFar++;
     return [Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)];
   }
  
   function* rollTwoDiceGeneratorFn() {
     while(true) {
       yield rollTwoDice();
     }
   }
  
   const myGeneratorDataset = tf.data.generator(rollTwoDiceGeneratorFn);
   await myGeneratorDataset.take(1).forEachAsync(e => console.log(e));
```
关于上面创建的游戏模拟数据集的一些有趣的注释。首先，注意这里创建的数据集myGeneratorDataset是无限的。由于生成器函数永远不会返回，因此可以想象从数据集中永远获取样本。如果我们要在这个数据集上执行forEachAsync() 或 toArray() （见第6.2.3节），它将永远不会结束，可能使我们的服务器或浏览器宕机，所以要小心。为了处理这些对象，我们需要创建一些其他数据集，这些数据集是使用take(n)无限数据集的有限示例。一会儿再谈这个。

其次，使用一个局部变量。这有助于记录和调试确定生成器函数执行了多少次。

第三，注意数据在被请求之前是不存在的。在这种情况下，我们只访问数据集的一个样本，这将反映在的值numPlaysSoFar中。

生成器数据集功能强大且极为灵活，允许开发人员将模型连接到各种提供API的数据，例如来自数据库查询、通过网络逐段下载的数据或连接的硬件的数据。

## 6.2.3访问数据集中的数据
一旦将数据作为一个数据集，就不可避免地要访问其中的数据。您可以创建但不读取的数据结构实际上没有用。有两个api来访问数据集中的数据，但使用不多。更高级别的api将为您访问数据集中的数据。例如，在训练模型时，我们使用下面第6.3节描述的model.fitDataset()的API。而我们用户，不需要直接访问数据。但了解调试、测试和理解Dataset对象如何工作是很重要的。

从数据集访问数据的第一种方法是使用Dataset.toArray()将数据流全部输出到数组中。它遍历整个数据集，将所有元素推送到一个数组中，并将该数组返回给用户。当执行此函数时，用户应该小心，不要无意中生成对JavaScript运行时来说太大的数组。例如，如果数据集连接到大型远程数据源，或者是从传感器读取的无限数据集，则很容易犯此错误。

从数据集访问数据的第二种方法是使用dataset.forEachAsync(f)在数据集的每个示例上执行函数。提供给forEachAsync()的参数将依次应用于每个元素，其方式类似于JavaScripts数组和集合中的构造的Array.forEach()和Set.forEach()方法。

必须注意，Dataset.forEachAsync()和Dataset.toArray()都是异步函数。这与Array.forEach()不同，后者是同步的，因此在这里很容易出错。Dataset.toArray()返回Promise，通常需要await或 .then()同步行为。请注意，如果忘记了，可能不会按您预期的顺序解决，错误将出现。

Dataset.forEachAsync()是异步的，Array.forEach()不是异步的原因是，数据集通常需要创建、计算或从远程源获取访问的数据。这里的异步性允许我们在等待时有效地利用可用的计算。
###### 表6.2在数据集上迭代的方法
| tf.data.Dataset对象的方法|用处|例子|
|--|--|--|
| .toArray()|异步迭代整个数据集，并将每个元素推送到返回的数组中。| const a = tf.data.array([1, 2, 3, 4, 5, 6]);const arr = await a.toArray();console.log(arr);|
| .forEachAsync(f)| 异步迭代数据集的所有元素，并对每个元素执行f。| const a = tf.data.array([1, 2, 3]);await a.forEachAsync(e => console.log("hi " + e));|


## 6.2.4处理tfjs-data数据集
当我们可以直接使用已经提供的数据而不进行任何清理或处理时，这当然是非常好的，但是，根据作者的经验，这几乎永远不会发生在为教育或基准测试而构建的示例之外。在更常见的情况下，必须以某种方式转换数据，然后才能将其分析或用于机器学习任务。例如，通常数据来源包含必须过滤的额外元素，或者某些数据需要解析、反序列化或重命名，或者数据是按顺序存储的，因此在使用它来训练或评估模型之前需要随机洗牌。为了训练和测试，必须将数据集分成不同的集合。预处理几乎是不可避免的。如果你遇到一个数据是可以开箱即用的，很可能有人已经为你做了清理和预处理！

tf.data.Dataset提供了一系列执行预处理的API，如表6.3所述。这些方法中的每一个都返回一个新Dataset对象，但不要以为数据集的所有元素都被复制了，或者每个方法调用的所有元素都被迭代了！tf.data.Dataset只以惰性的方式加载和转换元素。这些方法链接在一起而创建的数据集可以看作是一个程序，只在链的末端请求元素时执行。Dataset实例沿链式操作，可能要从远程源请求数据。

###### 表6.3 tf.data.Dataset对象上的链式方法
这些操作可以链接在一起，以创建简单但功能强大的处理管道。例如，要将一个数据集随机分成一个训练和测试数据集，您可以遵循清单6.4中的方法

| tf.data.Dataset 方法|用途|例子|
|--|--|--|
| .filter(predicate)| 返回仅包含预测计算结果为true的元素的数据集。| myDataset.filter(x => x < 10); 返回仅包含myDataset中小于10的值的数据集。|
|.map(transform)| 将提供的函数应用于数据集中的每个元素，并返回映射元素的新数据集。| myDataset.map(x => x * x); 返回原始数据集的平方值的数据集。|
|.mapAsync(asyncTransform)| 类似于map，但提供的函数必须是异步的。| myDataset.mapAsync(fetchAsync); 假设“fetchAsync”是一个异步函数，它产生从提供的url获取的数据，这将返回一个新的数据集，其中包含每个url处的数据。|
|.batch(batchSize,smallLastBatch?)| 将元素的连续跨距捆绑到单个元素组中，并将原始元素转换为张量。| const a = tf.data.array([1, 2, 3, 4, 5, 6, 7, 8]).batch(4);await a.forEach(e => e.print());// Prints://     Tensor [1, 2, 3, 4]//     Tensor [5, 6, 7, 8]|
| .concatenate( dataset)| 将两个数据集中的元素连接在一起，以形成新的数据集。| myDataset1.concatenate(myDataset2)； 返回一个数据集，该数据集将首先遍历myDataset1的所有值，然后遍历myDataset2的所有值。|
|.repeat(count)| 返回将在原始数据集上重复多次（可能不受限制）的数据集。| myDataset.repeat(NUM_EPOCHS)；返回一个数据集，该数据集将迭代myDataset NUM_EPOCHS的所有值次。如果NUM_EPOCHS为负数或未定义，则结果将迭代无限次。|
|.take(count)| 返回仅包含第一个计数示例的数据集。| myDataset.take(10); 返回仅包含myDataset的前10个元素的数据集。如果myDataset包含的元素少于10个，则不会有任何更改。|
|.skip(count)| 返回跳过第一个计数示例的数据集| myDataset.skip(10); 返回一个数据集，该数据集包含除前10个之外的所有myDataset元素。如果myDataset包含10个或更少的元素，则返回空数据集。|
|.shuffle(bufferSize,seed?)| 生成对原始数据集的元素进行无序处理的数据集。注意：这个洗牌是在大小bufferSize的窗口中随机选择的，因此保留了超出窗口大小的顺序。| const a = tf.data.array([1, 2, 3, 4, 5, 6]).shuffle(3);await a.forEach(e => console.log(e));// prints, e.g., 2, 4, 1, 3, 6, 5；按随机无序顺序打印值1到6。洗牌是部分的，因为不是所有的顺序都是可能的，因为窗口小于总数据大小。例如，最后一个元素6现在不可能是新顺序中的第一个元素，因为6需要向后移动超过bufferSize（3）空间。|

###### 清单6.4使用tf.data.Dataset创建训练/测试拆分，请参见tfjs-examples/iris-fitDataset/data.js
```js
const shuffleSeed = Math.floor(Math.random() * 10000);
   const trainData = tf.data.array(IRIS_RAW_DATA)
                       .shuffle(IRIS_RAW_DATA.length, shuffleSeed);
                       .take(N);
                       .map(preprocessFn);
   const testData = tf.data.array(IRIS_RAW_DATA)
                       .shuffle(IRIS_RAW_DATA.length, shuffleSeed);
                       .skip(N);
                       .map(preprocessFn);
```
需要注意的，我们希望将样本随机分配到训练和测试中，因此我们首先对数据进行洗牌。我们取前N个样本作为训练数据。对于测试数据，我们取剩余的。很重要的一点是，当我们抽取样本时，数据的洗牌方式是相同的，这样我们就不会在两个集合中使用相同的示例。
我们在跳过操作之后应用map函数。在跳过之前也可以调用.map（preprocessFn），但是即使是我们丢弃的示例，也会执行preprocessFn；这是一种计算浪费。可以使用以下代码段验证此行为：
###### 清单6.5演示Dataset.forEach skip()&map()交互
```js
let count = 0;
  
   // Identity function which also increments count.
   function identityFn(x) {
     count += 1;
     return x;
   }
  
   console.log('skip before map');
   await tf.data.array([1, 2, 3, 4, 5, 6])
     .skip(6)
     .map(identityFn)
     .forEachAsync(x => undefined);
   console.log(`count is ${count}`);
  
   console.log('map before skip');
   await tf.data.array([1, 2, 3, 4, 5, 6])
     .map(identityFn)
     .skip(6)
     .forEachAsync(x => undefined);
   console.log(`count is ${count}`);
// Prints:
 // skip before map
 // Count is 0
 // map before skip
 // Count is 6

```
dataset.map另一个常见的用途是规范化我们的输入数据。可以想象这样一个场景：我们有无限的输入样本，但希望输入为均值。为了抹平数据，我们首先需要计算分布的平均值，但是计算无限集的平均值是难于处理的。可以考虑抽取一个有代表性的样本，并计算该样本的平均值，但如果我们不知道正确的样本大小，我们可能会犯错误。比如一个几乎所有值都为0的分布，但每1000万个示例的值中只有一个值为1e9。这个分布的平均值是100，如果只取某一部分的集合，数据就会有问题。
我们可以按照下面的方式使用dataset api进行数据规范化，如清单6.6所示。在这个清单中，我们将持续记录我们看到了多少个样本，以及这些样本的总和是多少。下面的清单对标量（不是张量）进行操作，但是为张量设计的版本也具有类似的结构。
###### 清单6.6使用tf.data.map的流标准化
```js
function newStreamingZeroMeanFn() {
     let samplesSoFar = 0;
     let sumSoFar = 0;
  
     return (x) => {
       samplesSoFar += 1;
       sumSoFar += x;
       const estimatedMean = sumSoFar / samplesSoFar;
       return x - estimatedMean;
     }
   
   }
  
   const normalizedDataset1 = unNormalizedDataset1.map(newStreamingZeroMeanFn());
   const normalizedDataset2 = unNormalizedDataset2.map(newStreamingZeroMeanFn());
```
我们生成了一个新的映射函数，它将示例计数器和累加器进行联系。这是为了允许独立地规范化多个数据集。此解决方案也有自身局限性，特别是在sumSoFar或samplesSoFar中存在数值溢出的可能性时，因此需要注意一些问题。
