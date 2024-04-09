<template>
  <v-container>
    <v-row justify="center" class="mt-4">
      <v-tabs v-model="tab" style="display: flex; justify-content: center" align-tabs="center">
        <v-tabs-slider color="black"></v-tabs-slider>
        <v-tab
            v-for="item in itemstab"
            :key="item"
            style="font-size: 13px"
        >{{ item }}
        </v-tab>
      </v-tabs>
      <v-row justify="center" class="mt-4">
        <v-tabs-items v-model='tab' content-class="ma-0">

          <v-tab-item>
            <v-data-table
                :headers="headers"
                :items="items"
                disable-pagination
                :hide-default-footer="true"
                class="elevation-1"
            >
              <template v-for="header in headers" v-slot:[`item.${header.value}`]="{ item }">
                <div class="chip-container" v-if="typeof item[header.value] === 'number'">
                  <v-chip :color="getColor(item[header.value])" text-color="white">
                    {{ item[header.value] }}
                  </v-chip>
                </div>
                <div v-else >
                  {{ item[header.value] }}
                </div>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item>
            <v-data-table
                :headers="headersKol"
                :items="itemsKol"
                disable-pagination
                :hide-default-footer="true"
                class="elevation-1"
            >
              <template v-for="header in headersKol" v-slot:[`item.${header.value}`]="{ item }">
                <div class="chip-container" v-if="typeof item[header.value] === 'number'">
                  <v-chip :color="getColor(item[header.value])" text-color="white">
                    {{ item[header.value] }}
                  </v-chip>
                </div>
                <div v-else-if="typeof item[header.value] === 'object'">
                  <!-- Проверяем, является ли значение объектом -->
                  <div v-for="(subblockValue, subblockKey) in item[header.value]" :key="subblockKey">
                    <!-- Проходимся по подблокам и окрашиваем их -->
                    <v-chip :color="getColor(subblockValue)" text-color="white">
                      {{ subblockValue }}
                    </v-chip>
                  </div>
                </div>
                <div v-else>
                  {{ item[header.value] }}
                </div>
              </template>
            </v-data-table>
          </v-tab-item>

          <v-tab-item>
            <v-data-table
                :headers="headers"
                :items="itemsScore"
                disable-pagination
                :hide-default-footer="true"
                class="elevation-1"
            >
              <template v-for="header in headers" v-slot:[`item.${header.value}`]="{ item }">
                <div class="chip-container" v-if="typeof item[header.value] === 'number'">
                  <v-chip :color="getColor(item[header.value])" text-color="white">
                    {{ item[header.value] }}
                  </v-chip>
                </div>
                <div v-else>
                  {{ item[header.value] }}
                </div>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-row>
    </v-row>

  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [],
      items: [],
      itemsScore: [],
      headersKol: [{ text: 'Банк', value: 'companyName' }],
      itemsKol: [],
      itemstab: [
        'Качественные', 'Количественные', 'Итоговые',
      ],
      tab: 'a',
    };
  },
  created(){
    this.init()
  },
  mounted() {

  },
  methods: {
    getColor(rating) {
      if (rating === 2) return 'yellow';
      else if (rating === 3) return 'orange';
      else if (rating === 4) return 'red';
      else if (rating === 1) return 'green';
      else return 'grey';
    },
    async init(){
      const response = await this.$axios.get('/api/get_scores/')
      const alo = JSON.stringify(response.data)
      console.log(alo.slice(0, 600))
      // Качественные --------------------------------------------------------------------------------------------------
      // Сначала создаем заголовки на основе ключей блоков
      const blockNames = Object.values(response.data)
          .flatMap(companyData =>
              Object.entries(companyData).flatMap(([_, blockInfo]) =>
                  Object.keys(blockInfo)
              )
          );
      const uniqueBlockNames = [...new Set(blockNames)];

      // Создаем заголовки для v-data-table
      this.headers = [
        { text: 'Банк', value: 'companyName' },
        ...uniqueBlockNames.map(blockName => ({
          text: blockName,
          value: blockName
        }))
      ];

      // Преобразуем данные API в формат для v-data-table
      this.items = Object.entries(response.data).map(([companyName, blocksData]) => {
        const rowData = { companyName };

        // Добавляем информацию по каждому блоку
        Object.entries(blocksData).forEach(([blockNumber, blockInfo]) => {
          const blockName = Object.keys(blockInfo)[0];
          const blockValue = blockInfo[blockName];
          rowData[blockName] = blockValue.calculated_score_quality;
        });

        return rowData;
      });
      this.itemsScore = Object.entries(response.data).map(([companyName, blocksData]) => {
        const rowData = { companyName };

        // Добавляем информацию по каждому блоку
        Object.entries(blocksData).forEach(([blockNumber, blockInfo]) => {
          const blockName = Object.keys(blockInfo)[0];
          const blockValue = blockInfo[blockName];
          rowData[blockName] = Math.round(blockValue.calculated_overall_score);
        });

        return rowData;
      });
      // Качественные --------------------------------------------------------------------------------------------------
      // Динамическое определение заголовков таблицы
      const firstCompanyBlocks = Object.values(response.data)[0];
      Object.keys(firstCompanyBlocks).forEach(blockKey => {
        if (blockKey === '2') { // Если это блок "Capital Risk" с подблоками
          Object.keys(firstCompanyBlocks[blockKey]['Capital Risk'].subblocks).forEach(subblockKey => {
            this.headersKol.push({ text: subblockKey, value: subblockKey });
          });
        } else if (blockKey !== '3') {
          // Используйте названия блоков вместо их ключей
          const blockName = (blockKey === '1') ? 'BMA' : 'Liquidity';
          this.headersKol.push({ text: blockName, value: blockName });
        }
      });

      // Преобразование данных для каждой компании в строки таблицы
      this.itemsKol = Object.entries(response.data).map(([companyName, blocks]) => {
        let rowData = { companyName }; // Начальное заполнение строки названием компании

        Object.entries(blocks).forEach(([blockKey, blockValue]) => {
          let blockName;
          if (blockKey === '2') { // Обработка подблоков "Capital Risk"
            Object.entries(blockValue['Capital Risk'].subblocks).forEach(([subblockKey, value]) => {
              rowData[subblockKey] = value; // Присваивание значения подблока
            });
          } else { // Обработка основных блоков
            console.log(blockValue); // Проверяем содержимое блока
            // Проверяем наличие объекта 'BMA'
            if (blockValue['BMA']) {
              blockName = 'BMA'; // Если есть объект 'BMA', используем его имя
            }else if(blockValue['Risk Management']){
              blockName = 'Risk Management';
            }else if(blockValue['Liquidity']) {
              blockName = 'Liquidity';
            }else {
              blockName = blockKey; // В противном случае используем ключ
            }
            // Проверяем существование свойства calculated_score_quantity
            rowData[blockName] = blockValue[blockName] && 'calculated_score_quantity' in blockValue[blockName] ?
                parseInt(Math.round(blockValue[blockName].calculated_score_quantity)) : 'N/A';
            console.log(rowData[blockName])
          }
        });

        return rowData; // Возвращение обработанной строки для компании
      });
      this.headers = this.headers.map((header, index) => {
        if (index !== 0) {
          header.sortable = false; // Отключаем сортировку для всех, кроме первого заголовка
        }
        return header;
      });
      this.headersKol = this.headersKol.map((header, index) => {
        if (index !== 0) {
          header.sortable = false; // Отключаем сортировку для всех, кроме первого заголовка
        }
        return header;
      });
    },
  },
};
</script>

<style scoped>
/* Сброс стилей для всех ячеек */
::v-deep .v-data-table th,
::v-deep .v-data-table td {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}

::v-deep .v-data-table th,
::v-deep .v-data-table tr {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
::v-deep .v-data-table-header th {
  font-size: 16px!important; /* Укажите нужный размер шрифта */
  background-color: #f5f5f5; /* Светло-серый цвет фона */
  color: #333; /* Цвет текста, если нужно */
  text-align: center;
  width: 1fr;
}

.chip-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.text-center {
  text-align: center;
}
::v-deep .v-data-table th {
  text-align: center;
}
::v-deep .v-data-table tbody tr td:first-child {
  text-align: left; /* Или justify, в зависимости от желаемого эффекта */
}
::v-deep .v-data-table th:not(:first-of-type) {
  width: 120px; /* или можно использовать 100px или любое другое фиксированное значение */
}
/* Первому заголовку задаём автоматическую ширину, чтобы он мог занимать оставшееся пространство */
::v-deep .v-data-table th:first-of-type {
  width: auto;
}
::v-deep .v-data-table-header th:not(:first-of-type) {
  text-align: center!important;
}
</style>

