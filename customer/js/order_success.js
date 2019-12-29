let vm = new Vue({
    el: "#app",
    data: {
        haveLogin: false,
        loginUser: {},
        order: {}
    },
    created() {

        let that = this;

        let localStatus = localStorage.getItem("theLoginUser");
        let sessionStatus = sessionStorage.getItem("theLoginUser");
        if (localStatus !== null) {
            that.loginUser = JSON.parse(localStatus);
            that.haveLogin = true;
        } else if (sessionStatus !== null) {
            that.loginUser = JSON.parse(sessionStatus);
            that.haveLogin = true;
        }
        that.order = JSON.parse(sessionStorage.getItem("submitOrders"));
    },
    methods: {
        logout: function () {
            this.haveLogin = false;
            this.loginUser = {};
            localStorage.removeItem("theLoginUser");
            sessionStorage.removeItem("theLoginUser");
        },
    }

});