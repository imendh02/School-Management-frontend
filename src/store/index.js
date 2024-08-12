import { createStore } from 'vuex';
import classes from './Classes';
import students from './Students';

export default createStore({
  modules: {
    classes,
    students,
  },
});
