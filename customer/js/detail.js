$(function () {
    let $tab_btn = $('.detail_tab li');
    let $tab_con = $('.tab_content');
    $tab_btn.click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $tab_con.eq($(this).index()).addClass('current').siblings().removeClass('current');
    });
});

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
 * 当前商品详情页的商品
 */
let _product = new Vue({
    el: "#product_detail",
    data: {
        product: {},
        productNumber: 1
    },
    methods: {
        numberChange: function () {
            if (this.productNumber > this.product.productStock) {
                this.productNumber = this.product.productStock;
            }
            if (this.productNumber < 1) {
                this.productNumber = 1;
            }
        },
        buyProduct: function () {

        },
        addToCart: function () {
            let that = this;
            let userId = _loginStatus.loginUser.userId;
            if (userId !== null) {
                axios.post('http://localhost:8080/YouMall/cart/add.do', {
                    'userId': userId,
                    'product': that.product,
                    'productNumber': that.productNumber
                })
                    .then(function (response) {
                        let cartId = response.data;
                        let index = _cart.Carts.length;
                        let cart = {
                            "cartId": response.data,
                            "userId": userId,
                            "product": that.product,
                            "productNumber": that.productNumber
                        };
                        //查看购物车是否已经存在
                        _cart.Carts.forEach((item, i) => {
                            if (item.cartId === cartId) {
                                cart = item;
                                cart.productNumber += that.productNumber;
                                index = i;
                            }
                        });
                        _cart.$set(_cart.Carts, index, cart);
                        alert("已添加至购物车！");

                    })
            } else {
                alert("请先登录！");
            }
        }

    },
    created() {
        this.product = JSON.parse(sessionStorage.getItem("product"));
    },
    watch: {
        //监听productNumber属性值的变化
        productNumber: "numberChange"
    }
});

/**
 *三级分类
 */
let _category = new Vue({
    el: "#category",
    data: {
        allCategory: {}
    },
    created() {
        this.allCategory = JSON.parse(sessionStorage.getItem("category"));
    }
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
                })
                .catch(error => console.log(error));
        }
    }
});