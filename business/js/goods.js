let vm = new Vue({
    el: "#goods",
    data: {
        store: {},
        allProducts: {},
        showState: -1,
        allChecked: false
    },
    //跳转到编辑商品页面
    methods: {

        //跳转至商品编辑页面
        editProduct: function (product) {
            window.sessionStorage.setItem("editProduct", JSON.stringify(product));
            window.location.href = "goods_edit.html";
        },
        //批量删除商品
        deleteProducts: function () {

            let that = this;
            let productsId = []; //需删除的商品Id
            for (let i = 0; i < that.allProducts.length; i++) {
                if (that.allProducts[i].checked === true) {
                    productsId.push(that.allProducts[i].productId);
                }
            }

            //当选中有商品并确认时才提交
            if (productsId.length > 0) {
                let confirmMsg = confirm("确认删除选择的" + productsId.length + "件商品？");
                if (confirmMsg) {
                    axios.post("http://localhost:8080/YouMall/product/delete.do", productsId)
                        .then(function (response) {
                            if (response.data === productsId.length) {
                                alert("已删除！");
                                location.reload();
                            }
                        }).catch(error => console.log(error));
                }
            }
        },

        //判断列表是否全部选中
        checkAllChooseType: function () {
            let that = this;
            let all_checked = true;
            for (let i = 0; i < that.allProducts.length; i++) {
                if (that.allProducts[i].checked === false) {
                    all_checked = false;  //没有全选
                }
            }
            that.allChecked = all_checked;
        },

        //全选改变时执行，全选改变时改变所有列表项的选中状态
        allChecked_change: function () {
            let that = this;
            console.log(that.allChecked);
            if (that.allChecked) {
                for (let i = 0; i < that.allProducts.length; i++) {
                    that.allProducts[i].checked = true;
                }
            } else {
                for (let i = 0; i < that.allProducts.length; i++) {
                    that.allProducts[i].checked = false
                }
            }
        }
    },
    created() {
        let that = this;
        //加载店铺信息
        that.store = JSON.parse(sessionStorage.getItem("loginStore"));

        axios.get("http://localhost:8080/YouMall/product/load.do", {
            params: {
                storeId: that.store.storeId
            }
        }).then(function (response) {
            that.allProducts = response.data;

            //每个商品对象添加一个记录是否选中的属性
            for (let i = 0; i < that.allProducts.length; i++) {
                vm.$set(that.allProducts[i], "checked", false);
            }
        }).catch(error => console.log(error));
    }
});