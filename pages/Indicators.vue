<template>
  <v-container>
    <v-row
        justify="center"
        class="mt-4"
    >
      <h2 style="text-align: center; margin-bottom: 20px">{{this.BankName}}</h2>
      <v-col
          cols="12"
      >
        <v-data-table
            :headers="headers"
            :items="items"
            class="elevation-1 my-custom-table"
            disable-pagination
            :hide-default-footer="true"
        >
<!--          <template v-slot:[`item.block_ras`]="{ item }">-->
<!--            <span v-if="item.firstOfBlock">{{ item.block_ras }}</span>-->
<!--          </template>-->
<!--          <template v-slot:item.block_ras="{ item }">-->
<!--            <div v-if="item.isFirstInGroup" class="my-block-ras-cell">-->
<!--              {{ item.block_ras }}-->
<!--            </div>-->
<!--          </template>-->
          <template v-slot:[`item.block_ras`]="{ item }">
            <td :class="{'no-border-below': !item.isGroupLabel}">
              <div v-if="item.isFirstInGroup" class="my-block-ras-cell">
                {{ item.block_ras }}
              </div>
            </td>
          </template>
          <template v-slot:item.name="{ item }">
            <td :class="{ 'font-bold': item.name === 'Рейтинг по блоку' }">
              {{ item.name}}
            </td>
          </template>
          <template v-slot:item.value_numerator="{ item }">
            <td :class="{ 'no-border': item.name === 'Рейтинг по блоку' }">
              {{ item.name !== 'Рейтинг по блоку' ? item.value_numerator : '' }}
            </td>
          </template>
          <template v-slot:item.value_denominator="{ item }">
            <td :class="{ 'no-border': item.name === 'Рейтинг по блоку' }">
              {{ item.name !== 'Рейтинг по блоку' ? item.value_denominator : '' }}
            </td>
          </template>
          <template v-slot:item.percent="{ item }">
            <div :class="{'no-border': item.name === 'Рейтинг по блоку'}">
              {{ item.name !== 'Рейтинг по блоку' ? item.percent : '' }}
            </div>
          </template>
          <template v-slot:item.rating="{ item }">
            <v-chip :color="getColor(item.rating)" dark>
              {{ item.rating }}
            </v-chip>
          </template>

        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: 'Блок', value: 'block_ras' },
        { text: 'Наименование показателя', value: 'name' },
        { text: 'Значение числителя', value: 'value_numerator' },
        { text: 'Значение знаменателя', value: 'value_denominator' },
        { text: '%', value: 'percent' },
        { text: 'Рейтинг', value: 'rating', sortable: false }
      ],
      loading: true,
      fin_id: '',
      items: [],
      BankName: '',
      BankId: '',
    };
  },
  created() {
    this.getinit();
  },
  methods: {
    getColor(rating) {
      if (rating === 2) return 'yellow';
      else if (rating === 3) return 'orange';
      else if (rating === 4) return 'red';
      else if (rating === 1) return 'green';
      else return 'grey';
    },
    async getinit() {
      this.fin_id = this.$route.query.id
      const bank = await this.$axios.get('https://srep.finreg.kz/api/get_bank/', {
        params: {
          bank_id: this.fin_id
        }
      })
      this.BankName = bank.data[0].name_fins
      this.BankId = bank.data[0].id
      const response_indicators = await this.$axios.get('https://srep.finreg.kz/api/get_summary_of_indicators/' + this.fin_id + '/')

      // this.items = response_indicators.data
      const data = response_indicators.data
      const transformed = [];
      console.log("Исходные данные:", data);

      // Пример предполагает, что 'data' это объект верхнего уровня, например: { "АО \"Bereke Bank\"": { "1": { "BMA": {...} } } }
      for (const bankName in data) {
        console.log(`Банк: ${bankName}`, data[bankName]);

        const bankData = data[bankName];
        // Проходим по каждому блоку, например "1", "2", "3"...
        for (const blockNumber in bankData) {
          console.log(`Блок номер: ${blockNumber}`, bankData[blockNumber]);

          const block = bankData[blockNumber];
          // Проходим по каждой категории в блоке, например "BMA", "Capital Risk"...
          for (const categoryName in block) {
            console.log(`Категория: ${categoryName}`, block[categoryName]);

            const category = block[categoryName];
            // Теперь проверяем, существует ли свойство 'indicators'
            if (!category.indicators || typeof category.indicators !== 'object') {
              console.warn(`У категории ${categoryName} отсутствуют индикаторы или это не объект.`);
              continue; // Пропускаем итерацию, если индикаторов нет
            }

            for (const indicatorKey in category.indicators) {
              console.log(`Показатель: ${indicatorKey}`, category.indicators[indicatorKey]);

              const indicator = category.indicators[indicatorKey];
              if (!indicator || typeof indicator !== 'object' || indicator === null) {
                console.warn(`Индикатор ${indicatorKey} в категории ${categoryName} неверной структуры или null.`);
                continue; // Пропускаем итерацию, если структура индикатора неверная
              }

              transformed.push({
                block_ras: categoryName,
                code: indicatorKey.split(' ')[0],
                name: indicatorKey,
                value_numerator: indicator.value_numerator != null ? indicator.value_numerator.toLocaleString('ru-RU') : 'N/A',
                value_denominator: indicator.value_denominator != null ? indicator.value_denominator.toLocaleString('ru-RU') : 'N/A',
                percent: indicator.percent != null ? `${(indicator.percent).toFixed(2)}%` : 'N/A',
                rating: Math.round(category.calculated_score_quantity) || 'N/A'
              });
            }
          }
        }
      }

      console.log("Преобразованные данные:", transformed);
      this.items = transformed
      let previousBlockRas = null;
      this.items.forEach(item => {
        item.isFirstInGroup = previousBlockRas !== item.block_ras;
        previousBlockRas = item.block_ras; // Установите текущий block_ras как предыдущий для следующей итерации
      });
      // console.log(typeof(this.items))
      this.loading = false
    },
    extractIndicatorName(indicatorCode) {
      // Вам нужно написать функцию, которая извлекает имя показателя из кода или использует другой метод,
      // если имя показателя поступает отдельно
      return indicatorCode.split('.')[1].trim();
    },
    getRatingByPercent(percent) {
      // Ваша логика преобразования процента в рейтинг
      // Примерная логика, которую нужно адаптировать под вашу систему рейтингов
      if (percent >= 0.02) return 1;
      else if (percent >= 0.01) return 2;
      else if (percent >= 0.005) return 3;
      else return 4;
    },
  }
};
</script>

<style scoped>

::v-deep .v-data-table th,
::v-deep .v-data-table td {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

::v-deep .v-data-table .v-data-table__wrapper table td:last-of-type {
  border-right: none;
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
}
.my-block-ras-cell {
  /* Стили для ячейки, которая объединяет группу */
  grid-row: span 2; /* Растянуть ячейку на две строки, если это возможно в вашей версии Vuetify */
  background-color: white; /* Цвет фона, чтобы скрыть любые линии под ячейкой */
}

/* Теперь скрываем верхние и нижние границы для всех ячеек 'block_ras' */
::v-deep .v-data-table .v-table__overflow table td:first-of-type {
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}

/* Скрыть нижнюю границу для первой ячейки в группе, чтобы избежать видимой линии разделения */
::v-deep .v-data-table .v-table__overflow table tr td:first-of-type:not(.my-block-ras-cell) {
  border-top: none;
}

.no-border {
  border-right: 0 !important; /* Убрать правую границу */
}
/* Вы можете нуждаться в дополнительном селекторе для цели на v-data-table__cell если .no-border не достаточно */
::v-deep .v-data-table .v-data-table__wrapper table tbody tr td.no-border {
  border-right: 0 !important; /* Убрать правую границу */
}
.no-border-below {
  border-bottom: none;
}
::v-deep .v-data-table .text-center:last-child {
  text-align: center;
}
.text-center {
  text-align: center;
}
::v-deep .v-data-table tbody tr td:last-child {
  text-align: center!important;
}
.font-bold {
  font-weight: bold;
}
</style>
