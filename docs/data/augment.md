# 6.6 数据扩充
我们将收集的数据使用tf.data.Dataset进行调用。我们还能做些什么来帮助我们的模型更优呢？

有时您拥有的数据还不够，您希望以编程方式扩展数据集，通过对现有数据进行少量更改来创建新的示例。例如，第4章中的MNIST手写数字分类问题。MNIST包含60000张0-9手写数字的训练图像，每个数字约6000张。数字分类器模型是否很灵活呢？如果有人画的数字太大或太小怎么办？或者稍微旋转？还是歪斜的？或者用一支更厚或更薄的钢笔？我们的模型还能理解吗？

我们选取一个MNIST样本数字，并通过向左移动一个像素来改变图像，则该数字的语义标签不会改变。向左移动的9仍然是9，这又是一个新的训练示例。这种通过编程生成的示例（通过改变实际示例创建）称为伪示例，将伪示例添加到数据集的过程称为数据扩展。

数据扩展便从现有训练样本中生成更多训练数据的方法，诸如旋转、裁剪和缩放等变换通常可以得到可信的图像。其目的是增加训练数据的多样性，以利于训练模型的泛化能力（换句话说，减轻过度拟合），这在训练数据集规模较小时尤其有用。

图6.7显示了应用于一个输入示例的数据扩展，该输入示例由一个带有标签的图像数据集的猫图像组成。通过应用旋转和倾斜来扩展数据，使得示例的标签（即“CAT”）不会改变，但是输入示例显著改变。
###### 图6.7利用数据扩展生成猫图片。一个标记的示例通过随机旋转、反射、平移和倾斜，可以生成整个训练样本系列。
<img :src="$withBase('/data/6.7.png')" alt="figure6.7"/>
如果使用此数据扩展训练新模型，则模型将永远不会看到相同两次的输入。但样本间仍然有很大的相互关联性，因为它们由少量原始图像扩展得到。使用数据扩展的一个风险是，训练数据现在不太可能与推理数据的分布相一致，比如进行了倾斜操作。附加的训练伪示例的好处是否大于skew的成本取决于应用程序，您只需要对其进行测试和实验来决定。
清单6.24显示了如何使用dataset.map函数进行数据扩充，并将允许的转换注入到数据集中。请注意，每个示例都应该应用扩展。同样重要的是要看到扩展不应该应用于验证或测试集。

###### 清单6.24 在数据集上利用数据扩充训练模型
```js
function augmentFn(sample) {
     const img = sample.image;
     const augmentedImg = randomRotate(randomSkew(randomMirror(img))));
     return {image: augmentedImg, label: sample.label};
   }
  
   const (trainingDataset, validationDataset} = getDatsetsFromSource();
   augmentedDataset = trainingDataset.repeat().map(augmentFn).batch(BATCH_SIZE);
  
   // Train model
   await model.fitDataset(augmentedDataset, {
     batchesPerEpoch: ui.getBatchesPerEpoch(),
     epochs: ui.getEpochsToTrain(),
     validationData: validationDataset.repeat(),
     validationBatches: 10,
     callbacks: { … },
     }
   }
```
希望这一章能让你在使用机器学习模型之前理解数据的重要性。我们讨论了开箱即用的工具，例如Facets，您可以使用它来检查数据集，从而加深对它们的理解。但是，当您需要更灵活和自定义的数据时，有必要编写一些代码来完成这项工作。在下一章中，我们将向您介绍tfjs-vis的基础知识，tfjs-vis是一个由TensorFlow.js的作者维护的可视化模块，可以支持这种数据可视化用例。
