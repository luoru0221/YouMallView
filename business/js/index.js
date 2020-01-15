let vm = new Vue({
    el: "#business_index",
    data: {
        loginUser: {},
        haveLogin: false,
        store:{}
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

        if (that.haveLogin === false) {
            //将当前页面加入历史记录
            window.history.pushState(null, null, "../admin/index.html");
            window.location.href = "../shoplogin.html";
        } else if (that.loginUser.userType === 0) {
            //将当前页面加入历史记录
            window.history.pushState(null, null, "../admin/index.html");
            window.location.href = "../register.html";
        }

        //加载店铺信息
        if (that.haveLogin) {
            axios.get("http://localhost:8080/YouMall/store/load.do", {
                params: {
                    userId: that.loginUser.userId
                }
            }).then(function (response) {
                that.store = response.data;
                sessionStorage.setItem("loginStore",JSON.stringify(response.data));
            }).catch(error => console.log(error));
        }
    }
});