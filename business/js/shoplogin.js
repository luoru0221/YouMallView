let vm = new Vue({
    el: "#business_shoplogin",
    data: {
        input_error:false,
        user:{
            userPhone:"",
            userPassword:""
        }
    },
    methods:{
        login:function () {
            let that = this;
            that.check();
        },
        check:function() {
            let that = this;
            if(that.user.userPhone===""||that.user.userPassword===""){
                that.input_error = true;
            }else{
                axios.post("http://localhost:8080/YouMall/user/login.do",that.user)
                    .then(function (response) {
                        let data = response.data;
                        sessionStorage.setItem("theLoginUser",JSON.stringify(data.user));
                        window.history.back();
                    }).catch(error=>console.log(error));
            }
        }
    }
});