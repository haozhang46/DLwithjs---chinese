(window.webpackJsonp=window.webpackJsonp||[]).push([[39],{216:function(e,t,i){"use strict";i.r(t);var o=i(17),n=Object(o.a)({},(function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[i("h1",{attrs:{id:"_5-4-练习"}},[i("a",{staticClass:"header-anchor",attrs:{href:"#_5-4-练习"}},[e._v("#")]),e._v(" 5.4 练习")]),e._v(" "),i("ol",[i("li",[i("p",[e._v("当我们访问第 5.2 节中的 mnist-transfer-cnn 示例时，我们指出，除非在训练之前调用模型的 compile（）方法，否则在训练期间设置模型层的可训练属性不会生效。通过对示例文件 index.js 中的 retrainModel 方法进行一些更改来验证。比如：")]),e._v(" "),i("p",[e._v("a、 在带有 this.model.compile（）的行之前添加 this.model.summary（）调用，并观察可训练和不可训练参数的数量。它们显示了什么？它们与 compile（）调用后得到的数字有什么不同？")]),e._v(" "),i("p",[e._v("b、 独立于上面的“a”项，将 this.model.compile（）调用移到要素层可训练属性设置之前的部分。换句话说，在编译调用之后设置这些层的属性。如何改变训练速度？速度是否仅与正在更新的模型的最后几层一致？你能找到其他方法来确认在这种情况下，模型的前几层的权重在训练过程中是更新的吗？")])]),e._v(" "),i("li",[i("p",[e._v("在第 5.2 节（代码清单 5.1）中的迁移学习过程中，我们在开始调用 fit()之前将前两层 conv2d 层的可训练属性设置为 false，从而冻结了前两层。您能在 mnist-transfer-cnn 示例中的 index.js 中添加一些代码来验证 conv2d 层的权重是否确实没有被 fit()调用改变吗？我们在同一节中试验的另一种方法是在不冻结层的情况下调用 fit()。在这种情况下，您能否验证 fit()调用是否确实更改了层的权重值？（提示：回想一下，在第 2 章的第 2.4.2 节中，我们使用了模型对象的属性及其 getWeights()方法来访问权重值。）")])]),e._v(" "),i("li",[i("p",[e._v("转换 keras MobileNetV2[92]（不是 MobileNet V1！我们已经做到了。）将应用程序加载到 TensorFlow.js 格式，并在浏览器中将其加载到 TensorFlow.js 中。有关详细步骤，请参阅信息框 5.1。你能用 summary()这个方法检查 MobileNetV2 的拓扑结构并识别它与 MobileNet（V1）的主要区别吗？")])]),e._v(" "),i("li",[i("p",[e._v("清单 5.8 中关于微调代码的一个重要内容是，在解冻基础模型中的密集层之后，再次调用模型的 compile（）方法。")]),e._v(" "),i("p",[e._v("a、 在上面的练习 2 中使用相同的方法来验证第一次 fit（）调用（即，迁移学习初始阶段的调用）确实没有改变稠密层的权重（内核和偏差），并且它们确实是第二次 fit（）调用（即微调阶段的调用）所改变的？")]),e._v(" "),i("p",[e._v("b、 尝试在解冻行（即更改可训练属性值的行）之后注释掉 compile（）调用，并查看这对刚才观察到的权重值更改有何影响？确信 compile（）调用确实是让模型的冻结/解冻状态的更改生效所必需的。")]),e._v(" "),i("p",[e._v("c、 更改代码并尝试解冻基本语音命令模型的更多权重层（例如，倒数第二个密集层之前的 conv2d 层），然后查看这如何影响微调的结果。")])]),e._v(" "),i("li",[i("p",[e._v("在为简单目标检测任务定义的自定义丢失函数中，我们缩放了 0-1 形状标签，以便形状预测的错误信号可以与边界框预测的错误信号匹配（请参见代码清单 5.10）。")])]),e._v(" "),i("li",[i("p",[e._v("通过删除清单 5.10 中的代码中的 mul（）调用来尝试如果没有完成这种扩展会发生什么。这种缩放是必要的，以确保合理准确的形状预测。这也可以通过简单地在 compile 期间用 meanSquaredError 替换 customLossFunction 的实例来实现（请参见清单 5.11）。还要注意，在训练期间移除缩放需要伴随推理期间阈值的更改：在推理逻辑中将阈值从 CANVAS_SIZE/2 更改为 1/2（在 simple-object-detection/index.js 中）。")])]),e._v(" "),i("li",[i("p",[e._v("simple-object-detection 示例中的微调阶段涉及解冻被截断的 MobileNet 基的九个层（请参见清单 5.9 中 fineTuningLayers 的填充方式）。一个自然的问题是：为什么是 9 个？在本练习中，通过在 fineTuningLayers 数组中包含更少或更多层来更改未冻结层的数量。当您在微调期间解冻较少的层时，您希望看到以下：1）最终损失值，2）每个阶段在微调阶段所花费的时间？实验结果符合你的期望吗？在微调过程中解冻更多的图层如何？")])])])])}),[],!1,null,null,null);t.default=n.exports}}]);