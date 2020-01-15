let vm = new Vue({
    el: "#business_register",
    data: {
        loginUser: {},
        haveLogin: false,
        input_error:false,

        store: {
            storeId: -1,
            storeUserId: -1,
            storeName: "",
            storeType: "",
            storePhone: "",
            storeAddress: ""
        }
    },
    methods: {
        storeEnter: function () {
            let that = this;
            that.checkInput();
            if(that.input_error){
                alert("请正确并完整填写信息");
            }else{
                axios.post("http://localhost:8080/YouMall/store/enter.do",that.store)
                    .then(function (response) {
                        localStorage.setItem("store",JSON.stringify(response.data));
                        
                        //更新用户的类型
                        that.loginUser.userType = 1;
                        if(localStorage.getItem("theLoginUser")!==""){
                            localStorage.setItem("theLoginUser",JSON.stringify(that.loginUser));
                        }else{
                            sessionStorage.setItem("theLoginUser",JSON.stringify(that.loginUser));
                        }

                        //返回上一步
                        window.history.back();
                    }).catch(error=>console.log(error));
            }
        },
        checkInput: function () {
            let that = this;
            if(that.store.storeName===""||that.store.storeCompanyName===""||that.store.storePhone===""||that.store.storeAddress===""){
                that.input_error = true;
            }
        }
    },
    created() {
        let that = this;
        let localStatus = localStorage.getItem("theLoginUser");
        let sessionStatus = sessionStorage.getItem("theLoginUser");
        if (localStatus !== null) {
            this.loginUser = JSON.parse(localStatus);
            this.haveLogin = true;
        } else if (sessionStatus !== null) {
            this.loginUser = JSON.parse(sessionStatus);
            this.haveLogin = true;
        }

        //用户还未登录，跳转至登录页面
        if (that.haveLogin === false) {
            //将当前页面加入历史记录
            history.pushState(null, null, "../register.html");
            window.location.href = "shoplogin.html";
        } else {
            that.store.storeUserId = that.loginUser.userId;
        }
    }


});