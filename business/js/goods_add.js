let vm = new Vue({
    el: "#goods_add",
    data: {
        //三级分类信息
        allCategory: {},
        //当前店铺
        store: {},
        //待添加的商品
        product: {
            productCategory: -1,
            productName: "",
            productPrice: 0,
            productStock: 1,
            productIntroduction: "",
            productImage: "",
            productStoreId: -1,
        },

        firstCategory: {},
        secondCategory: {},
        thirdCategory: {}
    },
    methods: {
        //上传图片
        uploadImage: function () {
            let that = this;
            let file = document.getElementById("file").files[0];
            let file_data = new FormData();
            file_data.append("imageData", file);
            axios.post("http://localhost:8080/YouMall/product/upload.do", file_data, {headers: {'Content-Type': 'multipart/form-data'}})
                .then(function (response) {
                    that.product.productImage = response.data;
                }).catch(error => console.log(error));
        },

        //添加商品
        addProduct: function () {
            let that = this;
            console.log(that.product);
            if (that.checkInput()) {
                axios.post("http://localhost:8080/YouMall/product/add.do", that.product)
                    .then(function (response) {
                        let newProduct = response.data;
                        alert("添加成功！\n" +
                            "名称：" + newProduct.productName + "\n" +
                            "价格：" + newProduct.productPrice + "\n" +
                            "库存：" + newProduct.productStock
                        );
                        window.location.reload();
                    }).catch(error => console.log(error));
            }
        },
        checkInput: function () {
            let that = this;
            let product = this.product;
            if (product.productImage === "") {
                alert("请上传商品图片");
                return false;
            } else if (product.productName === "" || product.productPrice === "" || product.productIntroduction === "") {
                alert("请将商品信息填写完整");
                return false;
            } else if (product.productStock <= 0) {
                alert("库存必须大于0");
                return false;
            } else {
                that.product.productCategory = that.thirdCategory.categoryId;
                return true;
            }
        }

    },
    created() {
        let that = this;
        //加载店铺信息
        that.store = JSON.parse(sessionStorage.getItem("loginStore"));
        that.allCategory = JSON.parse(sessionStorage.getItem("category"));
        that.product.productStoreId = that.store.storeId;
        that.firstCategory = that.allCategory.childrenCategory[0];
    },
    watch: {
        firstCategory(val) {
            this.secondCategory = this.firstCategory.childrenCategory[0];
        },
        secondCategory(val) {
            this.thirdCategory = this.secondCategory.childrenCategory[0];
        }
    }

});
