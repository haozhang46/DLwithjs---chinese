module.exports = {
  base: '/DLwithjs---chinese/',
  title: '深度学习之Javascript',
  description: '深度学习之Javascript中文版',
  head: [
    ['link', { rel: 'icon', href: `/LOGO.jpg` }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  plugins: [
    '@vuepress/pwa',
    '@vuepress/back-to-top',
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-106861408-1'
      }
    ]
  ],
  themeConfig: {
    repo: 'Wendydesigner/DLwithjs---chinese',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '编辑此页',
    activeHeaderLinks: true,
    lastUpdated: '上次更新',
    adsConfig: [{ title: '与我交流', src: '/DLwithjs---chinese/wechat.png' }],
    nav: [
      { text: '正文', link: '/introduction/' },
      { text: '原书链接', link: 'https://livebook.manning.com/book/deep-learning-with-javascript/welcome/v-8/' }
    ],
    sidebar: [
      {
        title: '1.深度学习和Javascript',
        collapsable: true,
        path: '/introduction/',
        children: [
          '/introduction/dl.md',
          '/introduction/why.md',
          '/introduction/summary.md',
          '/introduction/exercises.md'
        ]
      },
      {
        title: '2.Tensorflow.js中线性回归',
        collapsable: true,
        path: '/liner/',
        children: [
          '/liner/example.md',
          '/liner/fit.md',
          '/liner/mutiinput.md',
          '/liner/how.md',
          '/liner/summary.md',
          '/liner/exercises.md'
        ]
      },
      {
        title: '3.非线性回归及加权',
        collapsable: true,
        path: '/nonliner/',
        children: [
          '/nonliner/what.md',
          '/nonliner/classify.md',
          '/nonliner/muti.md',
          '/nonliner/summary.md',
          '/nonliner/exercises.md'
        ]
      },
      {
        title: '4.卷积神经网络识别图像和声音',
        collapsable: true,
        path: '/convolution/',
        children: [
          '/convolution/imgRepresent.md',
          '/convolution/network.md',
          '/convolution/cnnNode.md',
          '/convolution/audioCnn.md',
          '/convolution/summary.md',
          '/convolution/exercises.md'
        ]
      },
      {
        title: '5.转移学习：重用预训练的神经网络',
        collapsable: true,
        path: '/transfer/',
        children: [
          '/transfer/introduction.md',
          '/transfer/example.md',
          '/transfer/summary.md',
          '/transfer/exercises.md'
        ]
      },
      {
        title: '6.数据集',
        collapsable: true,
        path: '/data/',
        children: [
          '/data/data.md',
          '/data/manageData.md',
          '/data/practice.md',
          '/data/patterns.md',
          '/data/flawed.md',
          '/data/augment.md',
          '/data/summary.md',
          '/data/exercises.md'
        ]
      },
      {
        title: '7.可视化数据和模型',
        collapsable: true,
        path: '/visualize/',
        children: []
      },
      {
        title: '8.欠拟合，过拟合和机器学习的通用工作流',
        collapsable: true,
        path: '/workflow/',
        children: []
      },
      {
        title: '9.深度学习之序列以及文本',
        collapsable: true,
        path: '/sequences/',
        children: []
      },
      {
        title: '10.生成型深度学习',
        collapsable: true,
        path: '/generative/',
        children: []
      },
      {
        title: '11.强化学习基础',
        collapsable: true,
        path: '/reinforcement/',
        children: []
      },
      {
        title: '12.测试，优化，部署模型',
        collapsable: true,
        path: '/deploy/',
        children: []
      },
      {
        title: '13.总结与展望',
        collapsable: true,
        path: '/summary/',
        children: []
      }
    ]
  }
};
