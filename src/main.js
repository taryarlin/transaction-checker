import 'vant/lib/index.css'
import './assets/main.css'

import { Button, Cell, CellGroup, Dialog, DropdownItem, DropdownMenu, Empty, Field, Form, Icon, Loading, NavBar, Swipe, SwipeCell, SwipeItem } from 'vant'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(Button)
app.use(Field)
app.use(CellGroup)
app.use(Empty)
app.use(Dialog)
app.use(Loading)
app.use(NavBar)
app.use(DropdownMenu);
app.use(DropdownItem);
app.use(Icon)
app.use(Form);
app.use(Cell);
app.use(SwipeCell)
app.use(Swipe);
app.use(SwipeItem);
app.mount('#app')
