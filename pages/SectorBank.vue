<template>
  <v-container>
    <v-row
        justify="center"
        class="mt-4"
    >
      <v-col
          cols="7"
      >
        <v-row>
          <v-col cols="12">
            <h1>Выбор объекта</h1>
          </v-col>
          <v-col>
            <v-data-table
                :headers="headers"
                :items="this.fins"
                :loading="!this.fins.length"
                loading-text="Загрузка..."
                disable-pagination
                :hide-default-footer="true"
                style="cursor: pointer; font-size: large"
                class="custom-table"
                @click:row="openForm">
              <template v-slot:item.total_score="{ item }">
                <div
                    style="text-align: center; margin-right: 15px">
                  {{ item.total_score}}
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
export default {
  data() {
    return {
      loading: true,
      fins: [],
      headers:[
        {text: '#', value: 'index'},
        {text: 'Наименование', value: 'name_fins'},
        {text: 'Рейтинг по качественным показателям', value: ''},
      ],
    };
  },
  created() {
    this.getinit();
  },
  methods: {
    openForm(item){
      console.log(item)
      this.$router.push({
        path: '/BMA',
        query: {id: item.id},
      })
    },
    async getinit() {
      const response = await this.$axios.get('https://srep.finreg.kz/api/getfins_sectorbank/')
      const ListToArray = Object.values(response.data);
      this.fins = ListToArray.map((item, index) => ({
        ...item,
        index: index + 1,
      }))
      console.log(this.fins)
      this.loading = false
    },
  }
};
</script>

<style scoped>
.v-data-table th {
  font-size: 16px;
}
.custom-table {
  border: 1px solid #ccc;
}
::v-deep .v-data-table-header > tr > th:nth-child(3) {
  text-align: center !important;
  vertical-align: middle !important;
}
</style>
