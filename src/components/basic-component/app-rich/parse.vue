
<template>
	<!--基础元素-->
	<view class="wxParse" :class="className" :style="'user-select:' + userSelect + ';background-color: ' + background">
		<template v-if="!loading">
			<block v-for="(node, index) of nodes" :key="index"  >
				<wxParseTemplate :node="node" :parent-node="nodes"/>
			</block>
		</template>
	</view>
</template>

<script>
import HtmlToJson from './libs/html2json';
import wxParseTemplate from './components/wxParseTemplate0';

export default {
	name: 'wxParse',
	props: {
		userSelect:{
			type:String,
			default:'text'
		},
		imgOptions:{
			type:[Object,Boolean],
			default:function(){
				return {
					loop: false,
					indicator:'number',
					longPressActions:false
				}
			}
		},
		loading: {
			type: Boolean,
			default: false
		},
		background: {
			type: String,
			default: '#ffffff'
		},
		className: {
			type: String,
			default: ''
		},
		content: {
			type: String,
			default: ''
		},
		noData: {
			type: String,
			default: ''
		},
		startHandler: {
			type: Function,
			default() {
				return node => {
					node.attr.class = null;
					node.attr.style = null;
				};
			}
		},
		endHandler: {
			type: Function,
			default: null
		},
		charsHandler: {
			type: Function,
			default: null
		},
		imageProp: {
			type: Object,
			default() {
				return {
					mode: 'aspectFit',
					padding: 0,
					lazyLoad: false,
					domain: ''
				};
			}
		},
	},
	components: {
		wxParseTemplate,
	},
	data() {
		return {
			nodes:{},
			imageUrls: [],
			wxParseWidth:{
				value:0
			}
		};
	},
	mounted() {
		this.setHtml();
	},
	methods: {
		setHtml(){
			let { content, noData, imageProp, startHandler, endHandler, charsHandler } = this;
			let parseData = content || noData;
			let customHandler = {
				start: startHandler,
				end: endHandler,
				chars: charsHandler
			};
			let results = HtmlToJson(parseData, customHandler, imageProp, this);
			this.imageUrls = results.imageUrls;
			this.nodes = results.nodes;
		},
		navigate(href, $event) {
			this.$emit('navigate', href, $event);
		},
		preview(src, $event) {
			if (!this.imageUrls.length || typeof this.imgOptions === 'boolean'){
			} else {
				uni.previewImage({
					current: src,
					urls: this.imageUrls,
					loop: this.imgOptions.loop,
					indicator: this.imgOptions.indicator,
					longPressActions: this.imgOptions.longPressActions
				});
			}
			this.$emit('preview', src, $event);
		},
		removeImageUrl(src) {
			const { imageUrls } = this;
			imageUrls.splice(imageUrls.indexOf(src), 1);
		}
	},
	watch: {
      content() {
        this.setHtml();
      }
    }
};
</script>
