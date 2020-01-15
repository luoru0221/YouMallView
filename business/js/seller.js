let vm = new Vue({
    el: "#seller",
    data: {
        store: {},
    },
    created(){
        let that = this;
      that.store = JSON.parse(sessionStorage.getItem("loginStore"));
    },
    methods:{

        updateStore:function () {
            let that = this;
            if(that.checkInput){
                axios.post("http://localhost:8080/YouMall/store/update.do",that.store)
                    .then(function (response) {
                        if(response.data===true){
                            alert("修改成功!");
                            sessionStorage.setItem("loginStore",JSON.stringify(that.store));
                        }else{
                            alert("系统异常，请稍后重试!");
                        }
                    }).catch(error=>console.log(error))
            }
        },
        checkInput:function () {
            let that = this.store;
            if(that.storeName===""||that.storeType===""||that.storePhone===""||that.storeAddress===""){
                alert("所有信息都不能为空！");
                return false
            }
            return true;
        }
    }

});