import { initData } from "@/api/data";

export default {
  data() {
    return {
      loading: true,
      data: [],
      page: 0,
      size: 10,
      total: 0,
      url: "",
      params: {},
      query: {},
      time: 170
    };
  },
  methods: {
    async init() {
      if (!(await this.beforeInit())) {
        return;
      }
      return new Promise((resolve, reject) => {
        this.loading = true;
        initData(this.url, this.params)
          .then(res => {
            if (res.totalElements) this.total = res.totalElements;
            this.data = res.content;
            if (res.content === undefined) {
              if (res.result.list === undefined) {
                this.data = res.result;
              } else if (res.result.list.length > -1) {
                this.data = res.result.list;
                this.total = res.result.total;
                console.log(this.data);
              }
            }
            setTimeout(() => {
              this.loading = false;
            }, this.time);
            resolve(res);
          })
          .catch(err => {
            this.loading = false;
            reject(err);
          });
      });
    },
    beforeInit() {
      return true;
    },
    pageChange(e) {
      this.page = e - 1;
      this.init();
    },
    sizeChange(e) {
      this.page = 0;
      this.size = e;
      this.init();
    }
  }
};
