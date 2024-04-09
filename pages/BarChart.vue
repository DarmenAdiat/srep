<template>
  <v-container>
    <template v-if="this.user_group=='reviewer'">
      <v-row justify="center" class="mt-4">
        <v-col cols="8">
          <v-row justify="center">
            <v-col cols="3">
              <h4>Финансовый идентификатор</h4>
              <v-divider/>
            </v-col>
            <template v-if="loading">
              <fade-loader :color="color" class="loading-indicator" :size="size"></fade-loader>
            </template>
            <template v-else>
              <v-expansion-panels>
                <v-expansion-panel v-for="fin in answerslist" :key="fin.name_fins">
                  <v-expansion-panel-header>
                    <v-row>
                      <v-col cols="3">
                        {{ fin.name_fins }}
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list dense>
                      <v-divider></v-divider>
                      <v-row>
                        <v-col cols="3">
                          <span style="text-decoration: underline">Наименование блока</span>
                        </v-col>
                      </v-row>
                      <v-list-item v-for="block in fin.block_progress" :key="block.block_id">
                        <v-list-item-content>
                          <v-expansion-panels>
                            <v-expansion-panel>
                              <v-expansion-panel-header>
                                <v-row>
                                  <v-col cols="3">
                                    {{ block.block_name }}
                                  </v-col>
                                </v-row>
                              </v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <v-list-item v-for="sub_process in block.sub_processes" :key="sub_process">
                                  <router-link :to="{ path: '/BMA?id=' + fin.id }"><button>
                                    {{ sub_process }}
                                  </button></router-link>
                                </v-list-item>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </template>

    <template v-else-if="this.user_group=='curator'">
      <v-row
          justify="center"
          class="mt-4"
      >
        <v-col cols="10">
          <v-row justify="center">
            <v-col
                cols="3">
              <h4 style="text-align-last: center">
                Банк
              </h4>
              <v-divider/>
            </v-col>
            <v-col
                cols="3">
              <h4 style="text-align-last: center">
                Степень заполнения
              </h4>
              <v-divider/>
            </v-col>
            <v-col
                cols="3">
              <h4 style="text-align-last: center">
                Рейтинг
              </h4>
              <v-divider/>
            </v-col>
            <v-col
                cols="3">
              <h4 style="text-align-last: center">
                Сформировать отчёт
              </h4>
              <v-divider/>
            </v-col>
            <template v-if="loading">
              <fade-loader :color="color" class="loading-indicator" :size="size"></fade-loader>
            </template>
            <template v-else>
              <v-expansion-panels>
                <v-expansion-panel v-for="fin in progresslist" :key="fin.name_fins">
                  <v-expansion-panel-header>
                    <v-row>
                      <v-col cols="3">
                        {{ fin.name_fins }}
                      </v-col>
                      <v-col cols="3">
                        <progress-bar
                            bar-color="#29537A"
                            size="medium"
                            :val="fin.overall_progress"
                            :text="fin.overall_text"/>
                      </v-col>
                      <v-col cols="3" style="margin-left:15px; text-align-last: center">
                        <div v-if="fin.overall_progress === 100">
                        {{ fin.final_score }}
                        </div>
                      </v-col>
                      <v-col cols="2" style="display: flex; justify-content: flex-end;">
                        <v-btn
                            small
                            style="background-color: #29537A; color: white; text-transform: none"
                            @click="report(fin)">Отчёт</v-btn>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-list dense>
                      <v-divider></v-divider>
                      <v-row style="margin-top: 15px">
                        <v-col cols="2">
                          <h4>Блок</h4>
                        </v-col>
                        <v-col cols="3">
                          <h4>Степень заполнения</h4>
                        </v-col>
                        <v-col cols="2" style="text-align: -webkit-center">
                          <h4>Качественный блок</h4>
                        </v-col>
                        <v-col cols="2" style="text-align: -webkit-center">
                          <h4>Количественный блок</h4>
                        </v-col>
                        <v-col cols="2" style="text-align: -webkit-center">
                          <h4>Итог</h4>
                        </v-col>
                      </v-row>
                      <v-list-item v-for="block in fin.block_progress">
                        <v-col cols="2">
                          {{ block.block_name }}
                        </v-col>
                        <v-col cols="3">
                          <progress-bar
                              bar-color="#29537A"
                              size="medium"
                              :val="block.percentage"
                              :text="block.progress"/>
                        </v-col>
                        <v-col cols="2" style="text-align: -webkit-center">
                          {{ block.calculated_score_quality }}
                        </v-col>
                        <v-col cols="2" style="text-align: -webkit-center">
                          {{ block.calculated_score_quantity }}
                        </v-col>
                        <v-col cols="2" style="text-align: -webkit-center; margin-left: 15px">
                          {{ block.calculated_overall_score }}
                        </v-col>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
          </v-row>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
import FadeLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  data() {
    return {
      progresslist: [],
      loading: true,
      color: '#29537A',
      size: '150px',
      user_group: '',
      user_id: '',
    }
  },
  components: {
    ProgressBar,
    FadeLoader
  },
  mounted() {
    // this.renderCharts()
    this.user_group = this.$auth.user.group[0].name
    this.user_id = this.$auth.user.user_id
  },
  created() {
    this.getItems()
  },
  methods: {
    report(event){
      console.log(event)
      this.$router.push({
        path: '/Report',
        query: {
          fin_id: event.id,
          user_id: this.user_id
        },
      })
    },
    async getItems() {
      // const fins = await this.$axios.get('https://srep.finreg.kz/api/getfins/')
      // this.itemlist = fins.data
      // console.log(this.itemlist)
      console.log(222222)
      console.log(this.$auth.user.group[0].name)
      if (this.$auth.user.group[0].name=='reviewer') {
        const response = await this.$axios.get('https://srep.finreg.kz/api/get_answers/',{
        params: {}
      })
        const answersListToArray = Object.values(response.data);
        this.answerslist = answersListToArray.map((item, index) => ({
          ...item,
          index: index + 1,
         
        }))
        this.loading = false
        console.log(this.answerslist)
    } else {
      const percentage = await this.$axios.get('https://srep.finreg.kz/api/object-reports/', {
        params: {
          user: this.$auth.user.user_id
        }
      }
      )
      console.log(percentage)
      const progressListToArray = Object.values(percentage.data);
      this.progresslist = progressListToArray.map((item, index) => ({
        ...item,
        index: index + 1,
        overall_text: 'Общая степень заполняемости: ' + parseFloat(item.overall_progress.toFixed(1)) + '%',
        block_progress: item.block_progress.map(block => ({
          ...block,
          calculated_overall_score: Math.round(block.calculated_overall_score),
          calculated_score_quality: Math.round(block.calculated_score_quality),
          calculated_score_quantity: Math.round(block.calculated_score_quantity),
        }))
      }))
      this.loading = false
      console.log(this.progresslist)
      this.loading = false
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
</style>
