let _login_form = new Vue({
    el: "#login_form",
    data: {
        userPhone: "",
        userPassword: "",
        passwordError: false,
        keepLogin: false
    },
    methods: {
        login: function () {
            let that = this;
            if (that.userPhone === "") {
                alert("请填写手机号！");
            } else if (that.userPassword === "") {
                alert("请填写密码");
            } else {
                axios.post("http://localhost:8080/YouMall/user/login.do", {
                    "userPhone": that.userPhone,
                    "userPassword": that.userPassword
                })
                    .then(function (response) {
                        let data = response.data;
                        let jwt = data.jwt;
                        if (data !== "") {
                            if (that.keepLogin) {
                                localStorage.setItem("theLoginUser", JSON.stringify(data.user));
                            }
                            sessionStorage.setItem("theLoginUser", JSON.stringify(data.user));
                            localStorage.setItem("jwt", jwt);
                            window.location.href = "index.html";
                        } else {
                            that.passwordError = true;
                        }
                    }).catch(error => console.log(error));
            }
        }
    }
});