Component({
  mixins: [],
  data: {
    textarea:{
      /**textarea输入与显示切换 */
      isShow:true,
      height:36,
      currentLength:0,
    }
  },
  props: {
    /**最大长度 */
    maxLength:140,
    /**textarea输入样式 */
    textareaClass:'',
    placeholderClass:'',
    placeholder:'输入消息内容...',
    textareaId:'msgTextarea',
    maxHeight:'300',
    modifyData:""
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onTextareaInput(e){
        //高度调整
        let value = e.detail.value;
        this.setTextareaData(value);
        // let rows = value.split(/\r?\n/).length;
        // this.textareaAutoHeight(rows);
        // let view = dd.createSelectorQuery().select("#"+this.props.textareaId).boundingClientRect();
        // console.log(view);
        if(this.$page.onInputChangeValueSet){
          this.$page.onInputChangeValueSet(e);
        }

    },
    onTextareaBlur(e){
      //替换显示
      this.textareaShow(false);
      let value = e.detail.value;
      this.setTextareaData(value);
      let page = this;
      
        
    },
    onTextareaPreviewTap(){
      this.textareaShow(true);
    },

    textareaShow(isShow){
      this.setData({"textarea.isShow":isShow});
    },
    setTextareaData(value){
      let rows = value.split(/\r?\n/).length-1;
      this.setData({"textarea.data":value,
      "textarea.currentLength":(this.props.maxLength?value.length+rows:0)
      });
    },
    textareaAutoHeight(rowNum){
      let singleRowHeight = 36;
      //每行36px
      let rowHeight = rowNum*singleRowHeight<this.props.maxHeight?(rowNum*36):this.props.maxHeight;
      console.log(rowHeight);
      this.setData({"textarea.height":rowHeight});
    }
  },
});
