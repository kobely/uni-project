export default {
    list: {},
    show: null,
    first: {},
    is_storage: false,
    setList(mark) {
        if (typeof this.list[mark] === 'undefined') {
            this.list[mark] = true;
        }
    },
}