<template>
  <v-container>
    <v-row
      justify="center"
      class="mt-4"
      >
      <v-col
        cols="10"
        sm="10"
        md="10"
        lg="10"
        >
        <v-row>
          <v-col cols="12">
          <h1>Выбор объекта</h1>
          </v-col>
          <v-col>
            <v-data-table
              :headers="headers"
              :items="this.progresslist"
              :search="search"
              item-key="bin"
              :loading="!this.progresslist.length"
              loading-text="Загрузка..."
              disable-pagination
              :hide-default-footer="true"
              style="cursor: pointer; font-size: large"
              class="custom-table"
              @click:row="openForm">
              <template v-slot:item.index="{ item }">
                <div class="text--primary" style="font-size: 16px;"> <!-- Увеличение размера шрифта -->
                  {{ item.index }}
                </div>
              </template>
              <template v-slot:item.name_fins="{ item }">
                <div class="text--primary" style="font-size: 16px;"> <!-- Увеличение размера шрифта -->
                  {{ item.name_fins}}
                </div>
              </template>
              <template v-slot:item.progress="{ item }" style="vertical-align: bottom!important;">
                <progress-bar
                    bar-color="#29537A"
                    size="medium"
                    :val="item.overall_progress"
                    :text="item.overall_text"/>
              </template>
              <template v-slot:item.final_score="{ item }">
                <div
                    v-if="item.overall_progress === 100"
                    class="text--primary"
                    style="font-size: 16px; text-align: center;">
                  {{ item.final_score}}
                </div>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
export default {
  data: vm => ({
    itemlist: [],
    progresslist: [],
    headers:[
      {text: '#', value: 'index'},
      {text: 'Наименование', value: 'name_fins'},
      {text: 'Прогресс', value: 'progress'},
      {text: 'Рейтинг SREP', value: 'final_score'},
    ],
    search: '',
  }),
  components: {
    ProgressBar
  },
  mounted() {
    // Преобразовать объект itemlist в массив
    this.itemlistToArray();
    this.getItems()
  },
  created() {
    // this.getItems()
  },
  methods:{
    itemlistToArray() {
      // Преобразовать объект itemlist в массив
      this.itemlist = Object.values(this.itemlist);
    },
    openForm(item){
      this.$router.push({
        path: '/BMA',
        query: item,
      })
    },
    async getItems(){
      // const itemlist = await this.$axios.get('https://srep.finreg.kz/api/getfins/', {
      //   params: {
      //     sector_id: 1
      //   }
      // })
      // console.log(itemlist)
      // const itemlist1 = itemlist.data.map((item, index) => ({
      //   ...item,
      //   index: index + 1,
      // }))
      // this.itemlist = Object.values(itemlist1)


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
        overall_text: 'Общая степень заполняемости: ' + parseFloat(item.overall_progress.toFixed(1)) + '%'
      }))
      this.loading = false
      console.log(this.progresslist)
    },
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
.v-data-table.v-data-table__wrapper table > tbody > tr > td:first-child {
  margin-right: 3px!important;
}
::v-deep .v-data-table-header th {
  text-align: center!important;
  vertical-align: middle!important;
}
</style>
