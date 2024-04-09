<template>
  <nav>
    <v-app-bar height="100px" app>
      <v-col sm="3" style="display: flex; align-items: center">
<!--      <v-app-bar-nav-icon @click.stop='drawer = !drawer'></v-app-bar-nav-icon>-->
      <img @click="routetomain" src="@/assets/output-onlinepngtools.png" alt="" style="max-width: 240px; cursor: pointer">
      </v-col>
<!--      <input type="text" class="input" v-model="input" placeholder="Поиск" style="margin-left: 50px"/>-->
      <v-divider vertical></v-divider>
      <!-- <v-menu
          offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
              v-on="on"
              class="custom-button"
              text
          >
            Качественные показатели
          </v-btn>
        </template>

        <v-list>
          <v-list-item
              v-for="(item, index) in sublinks"
              :key="index"
              router :to="item.route"
              @click="handleItemClick(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->
      <v-btn
          key="Кач"
          title='Качественные показатели'
          class="custom-button"
          @click="gotoBma"
          >
        <span>Качественные показатели</span>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
          key="Кол"
          title='Количественные показатели'
          class="custom-button"
          @click="gotoQualit">
        <span>Количественные показатели</span>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
          key="Отчёт"
          title='Отчёт результата проверки'
          @click="pie"
          class="custom-button">
        <span>Отчёт по системе</span>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn
          key="Прогресс"
          title='Прогресс оценки системе'
          @click="barchart"
          class="custom-button">
        <span>Отчёты SREP</span>
      </v-btn>
      <v-divider vertical></v-divider>
      <v-spacer></v-spacer>
      <v-btn
          title='Пользователь'
          text
          color='white'
          class="custom-button">
        <v-icon left>mdi-account</v-icon>
        <span>{{ this.username}}</span>
      </v-btn>
      <v-btn
        key="logout"
        title='Выйти из аккаунта'
        text
        color='white'
        @click="logout"
        class="custom-button">
        <v-icon left>mdi-logout</v-icon>
        <span>Выйти</span>
      </v-btn>
<!--      <v-btn-->
<!--        key="canvas"-->
<!--        title='Выйти из аккаунта'-->
<!--        text-->
<!--        @click="canvas"-->
<!--      >-->
<!--        <span>canvas</span>-->
<!--      </v-btn>-->
    </v-app-bar>
<!--    <v-navigation-drawer v-model="drawer" app temporary style="width: max-content">-->
<!--      <v-layout column>-->
<!--        <v-flex class="mt-5" style="display: flex; justify-content: center">-->
<!--          <v-icon style="margin: 0 7px 6px 0">mdi-account</v-icon>-->
<!--          <p class="black&#45;&#45;text subheading mt-3 text-center">{{this.username}}</p>-->
<!--        </v-flex>-->
<!--        <v-list flat>-->
<!--          <v-list-item-->
<!--              v-for="(link, index) in links"-->
<!--              :key="link.text"-->
<!--              router-->
<!--              :to="link.route"-->
<!--              active-class="border"-->
<!--          >-->
<!--            <v-list-item-action class="d-flex justify-center align-center">-->
<!--              <v-icon>{{ link.icon }}</v-icon>-->
<!--            </v-list-item-action>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title>{{ link.text }}</v-list-item-title>-->
<!--            </v-list-item-content>-->
<!--          </v-list-item>-->
<!--        </v-list>-->
<!--      </v-layout>-->
<!--    </v-navigation-drawer>-->
  </nav>
</template>

<script>




export default {
  name: "Navbar",
  data: () => ({
    drawer: false,
    input: '',
    username: '',
    bank_id: '',
    sublinks: [
      {title: 'BMA', route: '/BMA'},
      {title: 'Capital Risk', route: '/BMA'},
      {title: 'Risk Management', route: '/BMA'},
      {title: 'Liquidity', route: '/BMA'}
    ],
    username: '',
  }),
  components: {
    // Menubar
  },
  created(){
    this.checkup()
  },
  mounted() {
   
    if (this.$auth.loggedIn) {
      this.username = this.$auth.user.full_name
      this.bank_id = this.$auth.user.bank
      
      console.log('loggedin');
      console.log(this.username);
      console.log(this.$auth.user);
    }
  },
  computed:{
    links(){
      return[
        {icon: 'mdi-bank', text: 'Качественные показатели', route: {path: '/BMA', query: { id: this.bank_id }}},
        {icon: 'mdi-invoice-text-check-outline', text: 'Количественные показатели', route: '/BankSector'},
        {icon: 'mdi-cash-multiple', text: 'Отчёт результата проверки', route: '/BankSector'},
        {icon: 'mdi-domain', text: 'Прогресс оценки системе', route: '/BankSector'}
      ]
    },
    user(){
      return this.$auth.user
    },
  },
  methods:{
    checkup(){
      this.username = this.$route.query[0]
    },
    handleItemClick(item) {
      // Обработка нажатия на элемент подменю
      console.log('Clicked:', item);
    },
    async logout(){
      const refreshToken = localStorage.getItem('refreshToken');
      let accessToken = localStorage.getItem('accessToken');
      // const refreshToken = this.$auth.strategy.token.get();
      const response = await this.$axios.post('/api/token/refresh/', {
        refresh: refreshToken
      });
      accessToken = response.data.access;
      // Вызываем endpoint для логаута на бэкенде с передачей refresh токена
      await this.$axios.post('/api/token/logout/', {
            refresh: refreshToken
          }, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
      );
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');

      // Выполняем логаут на фронтенде и перенаправляем на страницу входа
      await this.$auth.logout();
      this.$router.push('/login');
    },
    pie(){
      this.$router.push('/BankPage')
    },
    barchart(){
      this.$router.push('/BarChart')
    },
    gotoQualit(){
      this.$router.push('/QualitativeIndicator')
    },
    gotoBma(){
      this.$router.push({
        path:'/SectorBank'
      })
    },
    routetomain(){
      this.$router.push('/BankSector')
    },
    canvas(){
      this.$router.push('/canv')
    }
  }
}
</script>

<style scoped>
input {
  display: block;
  width: 350px;
  margin: 20px auto;
  padding: 10px 45px;
  background: white no-repeat 15px center;
  background-size: 15px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
  rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}
.custom-button{
  color: white;
  background-color: transparent!important;
  box-shadow: none;
  text-transform: uppercase;
  font-size: 0.775rem;
}
.custom-button:hover {
  color: white; /* Цвет текста при наведении */
}
.custom-button::before {
  opacity: 0!important;
}
.custom-button:hover::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background-color: rgba(255,255,255,0.5); /* Цвет линии */
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
