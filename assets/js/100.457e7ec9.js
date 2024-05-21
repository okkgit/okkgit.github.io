(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{384:function(s,t,a){"use strict";a.r(t);var n=a(14),e=Object(n.a)({},(function(){var s=this,t=s._self._c;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h2",{attrs:{id:"容器探测"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#容器探测"}},[s._v("#")]),s._v(" 容器探测")]),s._v(" "),t("ul",[t("li",[s._v("用于检测容器中实例是否正常工作")]),s._v(" "),t("li",[s._v("通过执行某些代码，判断结果是否达到预期")]),s._v(" "),t("li",[s._v("未达到预期k8s会问题实例干掉")])]),s._v(" "),t("h2",{attrs:{id:"两种探测容器-探针"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#两种探测容器-探针"}},[s._v("#")]),s._v(" 两种探测容器 探针")]),s._v(" "),t("ul",[t("li",[s._v("liveness probe 存活性探测\n"),t("ul",[t("li",[s._v("是否正常状态，不正常重启")]),s._v(" "),t("li",[s._v("k8s尝试重启不正常的")])])]),s._v(" "),t("li",[s._v("readliness probe 就绪性探测\n"),t("ul",[t("li",[s._v("pod是否可以对外服务，如果不能，不会转发流量")]),s._v(" "),t("li",[s._v("某些pod需要时间准备，就绪后才可以")]),s._v(" "),t("li",[s._v("k8s尝试等待")])])])]),s._v(" "),t("h2",{attrs:{id:"探测配置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#探测配置"}},[s._v("#")]),s._v(" 探测配置")]),s._v(" "),t("div",{staticClass:"language-yaml line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-yaml"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" command\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" tcp\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" httpGet\n~~~ yaml\n  "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("livenessProbe")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("exec")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("command")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" cat\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("-")]),s._v(" /tmp/helthy\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("---")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("livenessProbe")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("tcpSocket")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("port")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("8080")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("---")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("livenessProbe")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("httpGet")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("path")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" /\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("port")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("80")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("host")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" 192.168.0.1\n      "),t("span",{pre:!0,attrs:{class:"token key atrule"}},[s._v("scheme")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(":")]),s._v(" HTTP "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# http 或https")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br")])]),t("h2",{attrs:{id:"容器探测其他配置项"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#容器探测其他配置项"}},[s._v("#")]),s._v(" 容器探测其他配置项")]),s._v(" "),t("ul",[t("li",[s._v("exec")]),s._v(" "),t("li",[s._v("tcpSocket")]),s._v(" "),t("li",[s._v("httpGet")]),s._v(" "),t("li",[s._v("initialDelaySeconds: int\n"),t("ul",[t("li",[s._v("延时一段时间后再开始探测循环")])])]),s._v(" "),t("li",[s._v("timeoutSeconds: int\n"),t("ul",[t("li",[s._v("探测超时 默认 1s")])])]),s._v(" "),t("li",[s._v("periodSeconds: int\n"),t("ul",[t("li",[s._v("循环周期长度")])])]),s._v(" "),t("li",[s._v("failureThreshold: int\n"),t("ul",[t("li",[s._v("探测多少次才算失败, 默认3 最小 1")])])]),s._v(" "),t("li",[s._v("successThreshold: int\n"),t("ul",[t("li",[s._v("连续探测几次才算成功,默认1")])])])])])}),[],!1,null,null,null);t.default=e.exports}}]);