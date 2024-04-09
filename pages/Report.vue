<template>
  <v-container>
    <v-card>
      <v-row justify="center" class="mt-4" style="margin: 20px">
        <h2 style="text-align: center; margin: 30px">{{this.BankName}}</h2>
        <v-col cols="12">
          <h2 style="text-align: center; margin: 15px">Качественные показатели</h2>
        </v-col>
        <v-col cols="11" justify="center">
          <v-row justify="center">
            <template v-for="item in blocks">
              <v-col cols="4">
                <h3>
                  Комментарий по блоку {{ item.name_block }}:
                </h3>
                <v-btn text small @click="toggleSubprocess(item.id)">
                  {{ item.showSubprocesses ? 'Скрыть' : 'Показать' }} подпроцессы
                </v-btn>
              </v-col>
              <v-col cols="8">
                <!--                    :value="newItemsArray.find(x => x.id === item.id)?.modal_block"-->
                <v-textarea
                    v-model="modalBlocks[item.id]"
                    clear-icon="mdi-close-circle"
                    spellcheck="true"
                    :label="item.name_block"
                    outlined
                ></v-textarea>
              </v-col>
              <transition name="fade" mode="out-in">
              <v-col cols="12" v-if="item.showSubprocesses">
              <!-- Для подпроцессов, создаем вложенный v-for -->
              <template v-for="subprocess in item.subprocess">
                <v-col cols="11" justify="center">
                  <v-row justify="center">
                    <v-col cols="4">
                      <h3>
                        Комментарий по подпроцессу {{ subprocess.name_subprocess }}:
                      </h3>
                    </v-col>
<!--                    :value="newSubprocessArray.find(x => x.id === subprocess.id)?.modal_subprocess"-->
                    <v-col cols="8">
                      <v-textarea
                          v-model="modalSubprocess[subprocess.id]"
                          clear-icon="mdi-close-circle"
                          spellcheck="true"
                          :label="subprocess.name_subprocess"
                          outlined
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
              </template>
              </v-col>
              </transition>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-card style="margin-top: 40px">
      <v-row justify="center" class="mt-4" style="margin: 20px">
        <v-col cols="12">
          <h2 style="text-align: center; margin: 15px">Количественные показатели</h2>
        </v-col>
        <v-col cols="11" justify="center">
          <v-row justify="center">
            <v-col cols="4">
              <h3>
                Комментарий по блоку BMA:
              </h3>
            </v-col>
            <v-col cols="8">
              <v-textarea
                  v-model="bma"
                  clear-icon="mdi-close-circle"
                  label="BMA"
                  clearable
                  spellcheck="true"
                  outlined
              ></v-textarea>
            </v-col>
            <v-divider/>
            <v-col cols="4">
              <h3>
                Комментарий по блоку Capital Risk:
              </h3>
            </v-col>
            <v-col cols="8">
              <v-textarea
                  v-model="capital_risk"
                  clear-icon="mdi-close-circle"
                  label="Capital Risk"
                  spellcheck="true"
                  clearable
                  outlined
              ></v-textarea>
            </v-col>
            <v-col cols="4">
              <h3>
                Комментарий по блоку Liquidity:
              </h3>
            </v-col>
            <v-col cols="8">
              <v-textarea
                  v-model="liquidity"
                  clear-icon="mdi-close-circle"
                  label="Liquidity"
                  spellcheck="true"
                  clearable
                  outlined
              ></v-textarea>
            </v-col>
          </v-row>
<!--          <v-btn-->
<!--              title='Сохранить'-->
<!--              @click="check"-->
<!--              style="background-color: #29537A; color: white; margin-bottom: 40px"-->
<!--          >-->
<!--            <span>Check</span>-->
<!--          </v-btn>-->
          <v-row>
            <v-col style="display: flex">
              <v-btn
                  title='Сохранить'
                  @click="send"
                  style="background-color: #29537A; color: white; margin-bottom: 40px"
              >
                <span>Сохранить</span>
              </v-btn>
              <v-btn
                  title="Сформировать"
                  @click="create"
                  style="background-color: #29537A; color: white; margin-bottom: 40px; margin-left: 10px; display: flex; align-items: center;"
              >
                <span>Сформировать отчёт</span>
                <v-progress-circular
                    v-if="loading_report"
                    indeterminate
                    color="white"
                    size="20"
                    style="margin-left: 10px;"
                ></v-progress-circular>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <v-snackbar
        v-model='snack'
        :timeout='3000'
        :color='snackColor'
    >
      {{ snackText }}
      <template #action='{ attrs }'>
        <v-btn
            v-bind='attrs'
            text
            @click='snack = false'
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
import FadeLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  data() {
    return {
      loading: true,
      color: '#29537A',
      user_group: '',
      user_id: '',
      fin_id: '',
      bma: '',
      capital_risk: '',
      liquidity: '',
      items: '',
      snack: false,
      snackColor: '',
      snackText: '',
      BankName: '',
      BankId: '',
      blocks: '',
      newItemsArray: [],
      newSubprocessArray: [],
      modalBlocks: {},
      modalSubprocess: {},
      loading_report: false,
    }
  },
  components: {
    ProgressBar,
    FadeLoader
  },
  mounted() {
    this.user_group = this.$auth.user.group[0].name
    this.user_id = this.$auth.user.user_id
    // this.newItemsArray.forEach(item => {
    //   this.$set(this.modalBlocks, item.id, item.modal_block);
    // });
  },
  watch: {
  },
  created() {
    this.init()
  },
  methods: {
    check(){
      console.log(this.modalSubprocess)
    },
    toggleSubprocess(id) {
      const item = this.blocks.find(item => item.id === id);
      if (item) {
        item.showSubprocesses = !item.showSubprocesses;
      }
    },
    async init() {
      this.fin_id = this.$route.query.fin_id
      this.user_id = this.$route.query.user_id
      const bank = await this.$axios.get('https://srep.finreg.kz/api/get_bank/', {
        params: {
          bank_id: this.fin_id
        }
      })
      this.BankName = bank.data[0].name_fins
      this.BankId = bank.data[0].id
      const response_block = await this.$axios.get('/api/block_for_report/')
      const spisok_block = response_block.data
      this.blocks = spisok_block.map(item => ({
        ...item,
        showSubprocesses: false, // Начальное состояние для подпроцессов - не показывать
      }))
      const response = await this.$axios.get('/api/modal_all/',{
        params:{
          fin_id: this.fin_id
        }
      })
      const spisok = response.data
      this.items = spisok.map(item => ({
        ...item,
        showSubprocesses: false, // Начальное состояние для подпроцессов - не показывать
      }))
      this.newItemsArray = this.items.map(item => {
        return {
          id: item.block,
          modal_block: item.modal_block
        };
      });
      this.newSubprocessArray = this.items.flatMap(item =>
          item.subprocesses.map(sub => ({
            id: sub.subprocess, // Предполагаем, что item.block это id блока
            modal_subprocess: sub.modal_subprocess // Доступ к modal_subprocess для каждого subprocess
          }))
      );
      this.newItemsArray.forEach(item => {
        this.$set(this.modalBlocks, item.id, item.modal_block);
      });
      this.newSubprocessArray.forEach(item => {
        this.$set(this.modalSubprocess, item.id, item.modal_subprocess);
      });
    },
    async create(){
      try{
        this.loading_report = true
        const response = await this.$axios.post('/api/parse/', {
          fin_id: parseInt(this.fin_id),
          bma: this.bma,
          capital_risk: this.capital_risk,
          liquidity: this.liquidity,
          bma_id: 1,
          capital_risk_id: 2,
          liquidity_id: 4,
        }, {
          responseType: 'blob', // Важно для получения файла
        });
        this.loading_report = false;
        this.snack = true
        this.snackColor = '#29537A'
        this.snackText = 'Сохранено!'
        // Создаем URL для скачивания
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Отчеты.zip'); // Устанавливаем имя файла для скачивания
        document.body.appendChild(link);
        link.click();

        // Очищаем ссылку после скачивания
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }catch (e) {
        console.log(e)
      }
    },
    async send(){
      try{
        // отправляю модалки по блокам
        const dataToSend = Object.entries(this.modalBlocks).map(([blockId, modalBlockText]) => {
          return {
            fin: this.fin_id, // предположим, что this.fin - это текущий идентификатор fin, который вы хотите отправить
            block: blockId,
            modal_block: modalBlockText
          };
        })
        for (const data of dataToSend) {
          try {
            const response_modal = await this.$axios.post('https://srep.finreg.kz/api/modal_block/', data);
            console.log(response_modal.data); // Обработайте ответ сервера, если это необходимо
            this.snack = true
            this.snackColor = '#29537A'
            this.snackText = 'Сохранено!'
          } catch (error) {
            console.error('Ошибка при отправке данных:', error);
          }
        }
        // отправляю модалки по подпроцессам
        const dataToSendSub = Object.entries(this.modalSubprocess).map(([subId, modalSubprocessText]) => {
          return {
            fin: this.fin_id, // предположим, что this.fin - это текущий идентификатор fin, который вы хотите отправить
            subprocess: parseInt(subId),
            modal_subprocess: modalSubprocessText
          }
        })
        for (const data of dataToSendSub) {
          try {
            const response_modal_sub = await this.$axios.post('https://srep.finreg.kz/api/modal_subprocess/', data);
            console.log(response_modal_sub.data); // Обработайте ответ сервера, если это необходимо
          } catch (error) {
            console.error('Ошибка при отправке данных:', error);
          }
        }
        // const response = await this.$axios.post('/api/parse/', {
        //   fin_id: parseInt(this.fin_id),
        //   bma: this.bma,
        //   capital_risk: this.capital_risk,
        //   liquidity: this.liquidity,
        //   bma_id: 1,
        //   capital_risk_id: 2,
        //   liquidity_id: 4,
        // }, {
        //   responseType: 'blob', // Важно для получения файла
        // });
        // this.snack = true
        // this.snackColor = '#29537A'
        // this.snackText = 'Сохранено!'
        // // Создаем URL для скачивания
        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'Отчет.docx'); // Устанавливаем имя файла для скачивания
        // document.body.appendChild(link);
        // link.click();
        //
        // // Очищаем ссылку после скачивания
        // window.URL.revokeObjectURL(url);
        // document.body.removeChild(link);
      }catch (e) {
        console.log(e)
      }
    }
  }

}
</script>

<style scoped>
.v-data-table th {
  font-size: 16px; /* Размер шрифта в пикселях или другие единицы измерения */
}

.custom-table {
  border: 1px solid #ccc; /* Граница толщиной 1 пиксель, цвет серый */
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Высота экрана */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* Цвет текста индикатора */
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active в версии 2.1.8 и ниже */ {
  opacity: 0;
}
</style>
