let vm = new Vue({
    el: "#good_edit",
    data: {

        allCategory: {},//三级分类

        product: {},//当前的商品

        nowCategory: [],//目前的分类

        firstCategory: {},
        secondCategory: {},
        thirdCategory: {},

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

        //保存修改信息
        saveProductEdit: function () {
            let that = this;
            if (that.checkInput()) {
                axios.post("http://localhost:8080/YouMall/product/update.do", that.product)
                    .then(function (response) {
                        if (response.data === true) {
                            alert("修改成功！");
                        } else {
                            alert("系统异常，请稍后重试");
                        }
                    }).catch(error => console.log(error));
            }
        },

        changeShelves: function () {
            let that = this;
            axios.post("http://localhost:8080/YouMall/product/updateShelves.do", that.product)
                .then(function (response) {
                    if (response.data === true) {
                        alert("修改成功！");
                    } else {
                        alert("系统异常，请稍后重试");
                    }
                }).catch(error => console.log(error));
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

        //加载当前商品
        let that = this;
        that.product = JSON.parse(sessionStorage.getItem("editProduct"));
        //加载三级分类信息
        that.allCategory = JSON.parse(sessionStorage.getItem("category"));

        //加载目前的分类信息
        axios.get("http://localhost:8080/YouMall/category/three.do", {
            params: {
                thirdCategoryId: that.product.productCategory
            }
        }).then(function (response) {
            that.nowCategory = response.data;

            //初始化选中的三级分类
            for (let i = 0; i < that.allCategory.childrenCategory.length; i++) {
                if (that.allCategory.childrenCategory[i].categoryId === that.nowCategory[0].categoryId) {
                    that.firstCategory = that.allCategory.childrenCategory[i]
                }
            }
            for (let i = 0; i < that.firstCategory.childrenCategory.length; i++) {
                if (that.firstCategory.childrenCategory[i].categoryId === that.nowCategory[1].categoryId) {
                    that.secondCategory = that.firstCategory.childrenCategory[i];
                }
            }
            for (let i = 0; i < that.secondCategory.childrenCategory.length; i++) {
                if (that.secondCategory.childrenCategory[i].categoryId === that.nowCategory[2].categoryId) {
                    that.thirdCategory = that.secondCategory.childrenCategory[i];
                }
            }

            /**
             * 监听前两级分类的变化
             */
            that.$watch("firstCategory",function (val) {
                that.secondCategory = val.childrenCategory[0];
            });
            that.$watch("secondCategory",function (val) {
                that.thirdCategory = val.childrenCategory[0];
            })
        }).catch(error => console.log(error));

    },
});
