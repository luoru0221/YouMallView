/**
 * 登录状态
 */
let _loginStatus = new Vue({
    el: "#login_status",
    data: {
        haveLogin: false,
        loginUser: {}
    },
    methods: {
        logout: function () {
            this.haveLogin = false;
            this.loginUser = {};
            localStorage.removeItem("theLoginUser");
            sessionStorage.removeItem("theLoginUser");
        }
    },
    created() {
        let localStatus = localStorage.getItem("theLoginUser");
        let sessionStatus = sessionStorage.getItem("theLoginUser");
        if (localStatus !== null) {
            this.loginUser = JSON.parse(localStatus);
            this.haveLogin = true;
        } else if (sessionStatus !== null) {
            this.loginUser = JSON.parse(sessionStatus);
            this.haveLogin = true;
        }
    }
});

/**
 * 商品展示
 */
let _products = new Vue({
    el: '#products',
    data: {
        showProducts: {}
    },
    created() {
        let that = this;
        axios.get('http://localhost:8080/YouMall/product/show.do')
            .then(function (response) {
                that.showProducts = response.data;
            })
            .catch(error => console.log(error));
    },
    methods: {
        detail: function (product) {
            sessionStorage.setItem("product", JSON.stringify(product));
            window.location.href = "detail.html";
        }
    }
});

/**
 * 三级分类
 */
let _category = new Vue({
    el: '#category',
    data: {
        allCategory: {}
    },
    created() {
        let that = this;
        axios.post('http://localhost:8080/YouMall/category/all.do', {})
            .then(function (response) {
                that.allCategory = response.data;
                //三级分类存入sessionStorage
                sessionStorage.setItem("category", JSON.stringify(that.allCategory));
            })
            .catch(error => console.log(error));
    },
});

/**
 * 购物车展示
 */
let _cart = new Vue({
    el: "#my_cart",
    data: {
        Carts: []
    },
    created() {
        let loginUser = JSON.parse(sessionStorage.getItem("theLoginUser"));
        if (loginUser === null) {
            loginUser = JSON.parse(localStorage.getItem("theLoginUser"));
        }
        if (loginUser !== null) {
            let that = this;
            axios.post('http://localhost:8080/YouMall/cart/someone.do', loginUser)
                .then(function (response) {
                    that.Carts = response.data;
                    console.log(response.data);
                })
                .catch(error => console.log(error));
        }
    }
});

