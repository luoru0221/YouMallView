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


let _carts = new Vue({
    el: "#carts",
    data: {
        Carts: [],
        allChecked: true
    },
    created() {
        let that = this;
        let loginUser = JSON.parse(localStorage.getItem("theLoginUser"));
        if (loginUser === null) {
            loginUser = JSON.parse(sessionStorage.getItem("theLoginUser"));
        }
        axios.post('http://localhost:8080/YouMall/cart/someone.do', loginUser)
            .then(function (response) {
                that.Carts = response.data;

                //为Carts数组中的每一个对象添加一个checked属性，跟单选框双向绑定
                for (let i = 0; i < that.Carts.length; i++) {
                    _carts.$set(that.Carts[i], "checked", true);
                }
            })
            .catch(error => console.log(error));
    },
    computed: {
        totalPrice: function () {
            let total = 0;
            for (let i = 0; i < this.Carts.length; i++) {
                if (this.Carts[i].checked) {
                    total += this.Carts[i].productNumber * this.Carts[i].product.productPrice;
                }
            }
            return total;
        },
        totalNumber: function () {
            let total = 0;
            for (let i = 0; i < this.Carts.length; i++) {
                if (this.Carts[i].checked) {
                    total++;
                }
            }
            return total;
        }
    },
    watch: {
        Carts: {
            handler: function (newValue) {
                let allCh = true;
                for (let i = 0; i < newValue.length; i++) {
                    if (newValue[i].productNumber > newValue[i].product.productStock) {
                        newValue[i].productNumber = newValue[i].product.productStock;
                    }
                    if (newValue[i].productNumber < 1) {
                        newValue[i].productNumber = 1;
                    }
                }
            },
            deep: true
        },
        allChecked: "allCheckedChange"
    },
    methods: {
        allCheckedChange: function () {
            for (let i = 0; i < this.Carts.length; i++) {
                this.Carts[i].checked = this.allChecked;
            }
        },
        order:function () {
            let checkedCart = [];
            for(let i = 0;i<this.Carts.length;i++){
                //为选中状态
                if(this.Carts[i].checked){
                    checkedCart.push(this.Carts[i]);
                }
            }
            if(checkedCart.length===0){
                alert("请选择宝贝！");
            }else {
                //存入sessionStorage
                sessionStorage.setItem("orderCart", JSON.stringify(checkedCart));
                window.location.href = "place_order.html";
            }
        }
    }

});