let vm = new Vue({
    el: "#app",
    data: {
        haveLogin: false,
        loginUser: {},

        orderCarts: [],
        order: {
            orderUserId: 0,
            orderUserName: "",
            orderUserAddress: "",
            orderUserPhone: "",
            orderUserEmail: "",
            orderMoney: "",
            orderItems: []
        },
        addressItems: [],
        defaultAddressId: 0,

        nowAddressIndex: 0

    },
    methods: {

        logout: function () {
            this.haveLogin = false;
            this.loginUser = {};
            localStorage.removeItem("theLoginUser");
            sessionStorage.removeItem("theLoginUser");
        },

        submitOrder: function () {
            let that = this;
            let orderItems = [];
            for (let i = 0; i < this.orderCarts.length; i++) {
                let orderItem = {
                    orderItemProductId: that.orderCarts[i].product.productId,
                    orderItemProductAmount: that.orderCarts[i].productNumber
                };
                orderItems.splice(i, 0, orderItem);
            }
            that.order.orderUserId = that.loginUser.userId;
            let address = that.addressItems[that.nowAddressIndex];
            that.order.orderUserName = address.receiveUserName;
            that.order.orderUserAddress = address.province + address.city + address.county + address.fullAddress;
            that.order.orderUserPhone = address.receiveUserPhone;
            that.order.orderUserEmail = address.receiveUserEmail;
            that.order.orderMoney = that.totalMoney;
            that.order.orderItems = orderItems;

            console.log(that.order);
            axios.post('http://localhost:8080/YouMall/order/submit.do', that.order)
                .then(function (response) {
                    if (response.data !== null) {
                        sessionStorage.setItem("submitOrders", JSON.stringify(response.data));
                        let carts = [];
                        for (let i = 0; i < that.orderCarts.length; i++) {
                            let cart = {
                                cartId: that.orderCarts[i].cartId
                            };
                            carts.splice(i, 0, cart)
                        }
                        axios.post('http://localhost:8080/YouMall/cart/delete.do', carts)
                            .then(function (response) {
                                if (response.data === true) {
                                    window.location.href = "order_success.html";
                                } else {
                                    alert("系统异常，请稍后重试");
                                }
                            })
                    }
                }).catch(error => console.log(error));

        }
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
        that.orderCarts = JSON.parse(sessionStorage.getItem("orderCart"));

        //加载所有地址
        axios.get('http://localhost:8080/YouMall/address/myAll.do', {
            params: {
                userId: that.loginUser.userId
            }
        }).then(function (response) {
            that.addressItems = response.data;
            //加载默认地址
            axios.get('http://localhost:8080/YouMall/address/default.do', {
                params: {
                    userId: that.loginUser.userId
                }
            }).then(function (response) {
                that.defaultAddressId = response.data;
                for (let i = 0; i < that.addressItems.length; i++) {
                    if (that.addressItems[i].addressId === that.defaultAddressId) {
                        that.nowAddressIndex = i;
                    }
                }
            })
        }).catch(error => console.log(error));

    },

    computed: {
        totalMoney: function () {
            let total = 0;
            for (let order of this.orderCarts) {
                total += order.productNumber * order.product.productPrice;
            }
            return total;
        }
    }

});
