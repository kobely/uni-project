<template>
	<!--判断是否是标签节点-->
	<block v-if="node.node === 'element'">
		<!--button类型-->
		<button v-if="node.tag === 'button'" type="default" size="mini" :class="node.classStr" :style="node.styleStr">
			<wx-parse-template :node="node" />
		</button>
		
		<!--a类型-->
		<view v-else-if="node.tag === 'a'" @click="wxParseATap(node.attr,$event)" :class="node.classStr" :data-href="node.attr.href" :style="node.styleStr">
			<block v-for="(item, index) of node.nodes" :key="index">
				<wx-parse-template :node="item" :parent-node="node"/>
			</block>
		</view>
		
		<!--div类型-->
		<view v-else-if="node.tag === 'div'" :class="node.classStr" :style="node.styleStr">
			<block v-for="(item, index) of node.nodes" :key="index">
				<wx-parse-template :node="item" :parent-node="node"/>
			</block>
		</view>
		
		<!--span类型-->
		<view v-else-if="node.tag === 'span'" :class="node.classStr" :style="node.styleStr">
            <block v-for="(item, index) of node.nodes" :key="index">
                <wx-parse-template :node="item" :parent-node="node"/>
            </block>
		</view>
		
		<!--p类型-->
		<view v-else-if="node.tag === 'p'" :class="node.classStr" :style="node.styleStr">
            <block v-for="(item, index) of node.nodes" :key="index">
                <wx-parse-template :node="item" :parent-node="node"/>
            </block>
		</view>
		
		<!--ul类型-->
		<view v-else-if="node.tag === 'ul'" :class="node.classStr" :style="node.styleStr">
            <block v-for="(item, index) of node.nodes" :key="index">
                <wx-parse-template :node="item" :parent-node="node"/>
            </block>
		</view>
		
		<!--li类型-->
		<view v-else-if="node.tag === 'li'" :class="node.classStr" :style="node.styleStr">
            <block v-for="(item, index) of node.nodes" :key="index">
                <wx-parse-template :node="item" :parent-node="node"/>
            </block>
		</view>
		
		<!--table类型-->
		<wx-parse-table v-else-if="node.tag === 'table'" :class="node.classStr" :style="node.styleStr" :node="node" />
		
		<!--br类型-->
		<text v-else-if="node.tag === 'br'">\n</text>
		
		<!--video类型-->
		<wx-parse-video :node="node" v-else-if="node.tag === 'video'"/>
	
		<!--audio类型-->
		<wx-parse-audio :node="node" v-else-if="node.tag === 'audio'"/>
	
		<!--img类型-->
		<wx-parse-img :parent-node="parentNode" :node="node" v-else-if="node.tag === 'img'" :style="node.styleStr"/>
		
		<!-- strong标签 -->
		<view v-else-if="node.tag === 'strong'" style="display: inline;font-weight: bold;">
            <block v-for="(item, index) of node.nodes" :key="index">
                <wx-parse-template :node="item" :parent-node="node"/>
            </block>
		</view>
		
		<!-- em标签 -->
		<view v-else-if="node.tag === 'em'" style="font-style: italic">
            <block v-for="(item, index) of node.nodes" :key="index">
                <wx-parse-template :node="item" :parent-node="node"/>
            </block>
		</view>
		
		<!-- section标签 -->
		<view v-else-if="node.tag === 'section'" >
            <block v-for="(item, index) of node.nodes" :key="index">
                <wx-parse-template :node="item" :parent-node="node"/>
            </block>
		</view>
		
<!--		&lt;!&ndash;其他标签&ndash;&gt;-->
		<view v-else :class="node.classStr" :style="node.styleStr">
			<block v-for="(item, index) of node.nodes" :key="index">
				<wx-parse-template :node="item" :parent-node="node"/>
			</block>
		</view>
	</block>
	
	<!--判断是否是文本节点-->
	<block v-else-if="node.node === 'text'">
		<text>{{node.text}}</text>
	</block>
</template>

<script>
    // #ifdef MP
	import wxParseTemplate from './wxParseTemplate0';
	// #endif
	import wxParseImg from './wxParseImg';
	import wxParseVideo from './wxParseVideo';
	import wxParseAudio from './wxParseAudio';
	import wxParseTable from './wxParseTable';
	
	export default {
		name: 'wxParseTemplate1',
		props: {
			node: {},
            parentNode: {}
		},
		components: {
		    // #ifdef MP
			wxParseTemplate,
            // #endif
			wxParseImg,
			wxParseVideo,
			wxParseAudio,
			wxParseTable
		},
		methods: {
			wxParseATap(attr,e) {
				const {
					href
				} = e.currentTarget.dataset;
				if (!href) return;
				let parent = this.$parent;
				while(!parent.preview || typeof parent.preview !== 'function') {
					parent = parent.$parent;
				}
				parent.navigate(href, e, attr);
			},
		},
	};
</script>
