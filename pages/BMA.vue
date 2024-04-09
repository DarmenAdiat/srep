<template>
  <v-container style="max-width: 1860px!important;">
    <!--    По куратору-->
    <template v-if="this.user_group=='curator'">
      <v-row justify="start" class="mt-3">
        <template v-if="loading">
          <fade-loader :color="color" class="loading-indicator" :size="size"></fade-loader>
        </template>
        <template v-else>
          <v-col
              cols="3"
              sm="3"
              md="3"
              lg="3"
              class="custom-width">
            <h2 style="text-align: center; margin-bottom: 20px">{{this.BankName}}</h2>
            <v-list expand>
              <template v-for="(block, index) in allist">
                <v-list-group
                    v-model="block.open"
                    style="min-width: -webkit-fill-available">
                  <template v-slot:activator>
                    <v-list-item-title><h3>{{ block.name }}</h3></v-list-item-title>
                  </template>
                  <v-list-item v-for="(subprocess, subIndex) in block.subprocesses" :key="subprocess.id">
                    <v-list-group
                        v-model="subprocess.open"
                        style="min-width: -webkit-fill-available">
                      <template v-slot:activator>
                        <v-list-item-title><h4>{{ subprocess.name }}</h4></v-list-item-title>
                      </template>
                      <v-list-item v-for="question in subprocess.questions" :key="question.id">
                        <v-list-item-action style="margin-right: 5px">
                          <v-icon v-if="validIds.includes(question.id)">mdi-check</v-icon>
                        </v-list-item-action>
                        <v-list-item-title
                            @click="handleClick(question, subprocess, block)"
                            style="cursor: pointer">
                          {{ question.position }}. {{ question.ask }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list-group>
                  </v-list-item>
                </v-list-group>
              </template>
            </v-list>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col
              cols="9"
              sm="9"
              md="9"
              lg="9"
          >
            <v-row justify="center" style="align-items: center">
              <v-col
                  cols="2"
                  sm="2"
                  md="2"
                  lg="2"
                  style="text-align: left"
                  @click="prevQuestion()">
                <v-btn color="white"
                       style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none;">
                  <v-icon style="color: black!important">mdi-chevron-left</v-icon>
                  Предыдущий вопрос
                </v-btn>
              </v-col>
              <v-col
                  cols="8"
                  sm="8"
                  md="8"
                  lg="8"
                  style="text-align: center">
                <h3>Блок: {{this.current_block_index.name}}</h3>
                <v-btn text small @click="dialog = true">Комментарий</v-btn>

                <v-dialog v-model="dialog" persistent max-width="600px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Комментарий к блоку</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <!-- Текстовое поле внутри модального окна -->
                            <v-textarea auto-grow label="Введите комментарий" v-model="block_comment"></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn outlined class="save" @click="dialog = false">Отмена</v-btn>
                      <v-btn outlined class="saveandgo" @click="saveValue">Сохранить</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col
                  cols="2"
                  sm="2"
                  md="2"
                  lg="2"
                  style="text-align: right">

                <v-btn
                    color="white"
                    :disabled="!isSubprocessSended"
                    style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none; margin-right: 150px;"
                    @click="send_review">
                  Отправить на ревью
                </v-btn>
<!--                <v-btn-->
<!--                    v-if="!ButtonEnabled"-->
<!--                    color="white"-->
<!--                    disabled-->
<!--                    style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none; margin-right: 150px;">-->
<!--                  Отправить на ревью-->
<!--                </v-btn>-->
                <!--                <v-btn-->
                <!--                    color="white"-->
                <!--                    style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none; margin-right: 150px;margin-top: 10px"-->
                <!--                    @click="send_review_back">-->
                <!--                  Отправить обратно-->
                <!--                </v-btn>-->
              </v-col>
              <v-col
                  cols="2"
                  sm="2"
                  md="2"
                  lg="2"
                  style="text-align: right">
                <v-btn
                    color="white"
                    style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none;"
                    @click="nextQuestion()">
                  Следующий вопрос
                  <v-icon style="color: black!important">mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-divider/>
              </v-col>
              <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  style="text-align: center">
                <h3>{{this.current_subprocess}}</h3>
                <v-btn text small @click="dialogSub = true">Комментарий</v-btn>

                <v-dialog v-model="dialogSub" persistent max-width="600px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Комментарий к подпроцессу</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea auto-grow label="Введите комментарий" v-model="block_comment_sub"></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn outlined class="save" @click="dialogSub = false">Отмена</v-btn>
                      <v-btn outlined class="saveandgo" @click="saveValueSub">Сохранить</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12">
                <v-form v-model="valid">
                  <v-container>
                    <v-row>
                      <v-col
                          cols="12"
                          md="3"
                      >
                        <p outlined>{{this.current_question}}</p>
                      </v-col>

                      <v-col
                          cols="12"
                          md="2"
                      >
                        <v-autocomplete
                            v-model="main_answer[current_question_index.id]"
                            label="Ответ"
                            v-if="this.criteries_count==0 || this.answerable === true""
                            :items="this.current_answer"
                            item-text="value"
                            item-value="key"
                        ></v-autocomplete>
                      </v-col>

                      <v-col
                          cols="12"
                          md="4"
                      >
                        <v-textarea
                            label="Комментарий куратора"
                            v-model="main_curator[current_question_index.id]"
                            spellcheck="true"
                            auto-grow
                            clearable
                            v-if="this.criteries_count==0 || this.answerable === true""
                            rows="1"
                        ></v-textarea>
                      </v-col>
                      <v-col
                          cols="12"
                          md="2"
                      >
                        <v-textarea
                            label="Комментарий ревьюера"
                            v-model="main_reviewer[current_question_index.id]"
                            auto-grow
                            clearable
                            v-if="this.criteries_count==0 || this.answerable === true""
                            rows="1"
                            disabled
                        ></v-textarea>
                      </v-col>
                      <v-col
                          cols="12"
                          md="1"
                      >
                        <v-file-input
                            v-model="file"
                            v-if="this.criteries_count==0 || this.answerable === true""
                            prepend-icon="mdi-paperclip"
                            @change="handleFileUpload"
                            disabled
                        ></v-file-input>
                      </v-col>
                      <template v-for="criteria in current_question_index.criteries">
                        <v-col
                            cols="12"
                            md="3"
                        >
                          <p>{{criteria.criteries_ask}}</p>
                        </v-col>

                        <v-col
                            cols="12"
                            md="2"
                        >
                          <v-autocomplete
                              v-model="answers[criteria.id]"
                              :items="passtheMutiple(criteria)"
                              @input="onAnswerSelected"
                              item-text="value"
                              item-value="key"
                              label="Ответ"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                            cols="12"
                            md="4"
                        >
                          <v-textarea
                              label="Комментарий куратора"
                              v-model="curators[criteria.id]"
                              auto-grow
                              spellcheck="true"
                              clearable
                              rows="1"
                          ></v-textarea>
                        </v-col>
                        <v-col
                            cols="12"
                            md="2"
                        >
                          <v-textarea
                              label="Комментарий ревьюера"
                              v-model="main_reviewer[criteria.id]"
                              auto-grow
                              clearable
                              rows="1"
                              disabled
                          ></v-textarea>
                        </v-col>
                        <v-col
                            cols="12"
                            md="1"
                        >
                          <v-file-input
                              v-model="file"
                              prepend-icon="mdi-paperclip"
                              @change="handleFileUpload"
                              disabled
                          ></v-file-input>
                        </v-col>
                      </template>
                    </v-row>
                  </v-container>
                </v-form>
              </v-col>
              <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  style="text-align: right">
                <!--              <v-btn outlined class="save" style="margin-right: 15px" @click="saved">Сохранить</v-btn>-->
                <v-btn outlined class="save" @click="saved">
                  Сохранить
                </v-btn>
                <v-btn outlined class="saveandgo" @click="savedandgo">
                  Сохранить и перейти к следующему
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
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
        </template>
      </v-row>
    </template>
    <!--    По ревьюеру-->
    <template v-else-if="this.user_group=='reviewer'">
      <v-row justify="start" class="mt-3">
        <template v-if="loading">
          <fade-loader :color="color" class="loading-indicator" :size="size"></fade-loader>
        </template>
        <template v-else>
          <v-col
              cols="3"
              sm="3"
              md="3"
              lg="3">
            <h2 style="text-align: center; margin-bottom: 20px">{{this.BankName}}</h2>
            <v-list expand>
              <template v-for="(block, index) in allist">
                <v-list-group
                    v-model="block.open"
                    style="min-width: -webkit-fill-available">
                  <template v-slot:activator>
                    <v-list-item-title><h3>{{ block.name }}</h3></v-list-item-title>
                  </template>
                  <v-list-item v-for="(subprocess, subIndex) in block.subprocesses" :key="subprocess.id">
                    <v-list-group
                        v-model="subprocess.open"
                        style="min-width: -webkit-fill-available">
                      <template v-slot:activator>
                        <v-list-item-title><h4>{{ subprocess.name }}</h4></v-list-item-title>
                      </template>
                      <v-list-item v-for="question in subprocess.questions" :key="question.id">
                        <v-list-item-action style="margin-right: 5px">
                          <v-icon v-if="answeredQuestions.includes(question.id)">mdi-check</v-icon>
                        </v-list-item-action>
                        <v-list-item-title
                            @click="handleClick(question, subprocess, block)"
                            style="cursor: pointer">
                          {{ question.position }}. {{ question.ask }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list-group>
                  </v-list-item>
                </v-list-group>
              </template>
            </v-list>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col
              cols="9"
              sm="9"
              md="9"
              lg="9"
          >
            <v-row justify="center" style="align-items: center">
              <v-col
                  cols="2"
                  sm="2"
                  md="2"
                  lg="2"
                  style="text-align: left"
                  @click="prevQuestion()">
                <v-btn color="white"
                       style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none;">
                  <v-icon style="color: black!important">mdi-chevron-left</v-icon>
                  Предыдущий вопрос
                </v-btn>
              </v-col>
              <v-col
                  cols="8"
                  sm="8"
                  md="8"
                  lg="8"
                  style="text-align: center">
                <h3>Блок: {{this.current_block_index.name}}</h3>
                <v-btn text small @click="dialog = true">Комментарий</v-btn>

                <v-dialog v-model="dialog" persistent max-width="600px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Комментарий к блоку</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <!-- Текстовое поле внутри модального окна -->
                            <v-textarea auto-grow label="Введите комментарий" v-model="block_comment"></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn outlined class="save" @click="dialog = false">Отмена</v-btn>
                      <v-btn outlined class="saveandgo" @click="saveValue">Сохранить</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col
                  cols="2"
                  sm="2"
                  md="2"
                  lg="2"
                  style="text-align: right">

                <v-btn
                    v-if="ButtonEnabled"
                    color="white"
                    style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none; margin-right: 150px;"
                    @click="send_review">
                  Отправить на ревью
                </v-btn>
                <v-btn
                    v-if="!ButtonEnabled"
                    color="white"
                    disabled
                    style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none; margin-right: 150px;">
                  Отправить на ревью
                </v-btn>
                <v-btn
                    color="white"
                    style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none; margin-right: 150px;"
                    @click="send_review_back">
                  Отправить обратно
                </v-btn>
              </v-col>
              <v-col
                  cols="2"
                  sm="2"
                  md="2"
                  lg="2"
                  style="text-align: right">
                <v-btn
                    color="white"
                    style="background-color: rgb(177 177 177 / 20%) !important; box-shadow: none; text-transform: none;"
                    @click="nextQuestion()">
                  Следующий вопрос
                  <v-icon style="color: black!important">mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-divider/>
              </v-col>
              <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  style="text-align: center">
                <h3>{{this.current_subprocess}}</h3>
                <v-btn text small @click="dialogSub = true">Комментарий</v-btn>

                <v-dialog v-model="dialogSub" persistent max-width="600px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">Комментарий к подпроцессу</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-textarea auto-grow label="Введите комментарий" v-model="block_comment_sub"></v-textarea>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn outlined class="save" @click="dialogSub = false">Отмена</v-btn>
                      <v-btn outlined class="saveandgo" @click="saveValueSub">Сохранить</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-col>
              <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12">
                <v-form v-model="valid">
                  <v-container>
                    <v-row>
                      <v-col
                          cols="12"
                          md="3"
                      >
                        <p outlined>{{this.current_question}}</p>
                      </v-col>

                      <v-col
                          cols="12"
                          md="2"
                      >
                        <v-autocomplete
                            v-model="main_answer[current_question_index.id]"
                            label="Ответ"
                            v-if="this.criteries_count==0"
                            :items="this.current_answer"
                            item-text="value"
                            item-value="key"
                        ></v-autocomplete>
                      </v-col>

                      <v-col
                          cols="12"
                          md="4"
                      >
                        <v-textarea
                            label="Комментарий куратора"
                            v-model="main_curator[current_question_index.id]"
                            auto-grow
                            spellcheck="true"
                            clearable
                            v-if="this.criteries_count==0"
                            rows="1"
                        ></v-textarea>
                      </v-col>
                      <v-col
                          cols="12"
                          md="2"
                      >
                        <v-textarea
                            label="Комментарий ревьюера"
                            v-model="main_reviewer[current_question_index.id]"
                            auto-grow
                            clearable
                            v-if="this.criteries_count==0"
                            rows="1"
                            disabled
                        ></v-textarea>
                      </v-col>
                      <v-col
                          cols="12"
                          md="1"
                      >
                        <v-file-input
                            v-model="file"
                            v-if="this.criteries_count==0"
                            prepend-icon="mdi-paperclip"
                            @change="handleFileUpload"
                            disabled
                        ></v-file-input>
                      </v-col>
                      <template v-for="criteria in current_question_index.criteries">
                        <v-col
                            cols="12"
                            md="3"
                        >
                          <p>{{criteria.criteries_ask}}</p>
                        </v-col>

                        <v-col
                            cols="12"
                            md="2"
                        >
                          <v-autocomplete
                              v-model="answers[criteria.id]"
                              :items="passtheMutiple(criteria)"
                              @input="onAnswerSelected"
                              item-text="value"
                              item-value="key"
                              label="Ответ"
                          ></v-autocomplete>
                        </v-col>
                        <v-col
                            cols="12"
                            md="3"
                        >
                          <v-textarea
                              label="Комментарий куратора"
                              v-model="curators[criteria.id]"
                              auto-grow
                              spellcheck="true"
                              clearable
                              rows="1"
                          ></v-textarea>
                        </v-col>
                        <v-col
                            cols="12"
                            md="3"
                        >
                          <v-textarea
                              label="Комментарий ревьюера"
                              v-model="main_reviewer[criteria.id]"
                              auto-grow
                              clearable
                              rows="1"
                              disabled
                          ></v-textarea>
                        </v-col>
                        <v-col
                            cols="12"
                            md="1"
                        >
                          <v-file-input
                              v-model="file"
                              prepend-icon="mdi-paperclip"
                              @change="handleFileUpload"
                              disabled
                          ></v-file-input>
                        </v-col>
                      </template>
                    </v-row>
                  </v-container>
                </v-form>
              </v-col>
              <v-col
                  cols="12"
                  sm="12"
                  md="12"
                  lg="12"
                  style="text-align: right">
                <!--              <v-btn outlined class="save" style="margin-right: 15px" @click="saved">Сохранить</v-btn>-->
                <v-btn outlined class="save" @click="saved">
                  Сохранить
                </v-btn>
                <v-btn outlined class="saveandgo" @click="savedandgo">
                  Сохранить и перейти к следующему
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
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
        </template>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import FadeLoader from 'vue-spinner/src/ClipLoader.vue'

export default {
  data: () => ({
    headers: [
      {text: '#', value: 'index'},
      {text: 'Наименование', value: 'name_block'}
    ],
    allist: [],
    answeredQuestions: [],
    search: '',
    valid: '',
    current_question: '',
    current_subprocess: '',
    current_question_index: '',
    current_subprocess_index: '',
    current_block_index: '',
    current_answer: '',
    snack: false,
    snackColor: '',
    snackText: '',
    main_answer: {},
    main_curator: {},
    main_reviewer: {},
    answers:{},
    curator: '',
    curators:{},
    criteries_count: 0,
    loading: true,
    color: '#29537A',
    size: '150px',
    height: '5px',
    width: '5px',
    BankName: '',
    BankId: null,
    user_id: null,
    file: null,
    uploadPercentage: 0,
    dialog: false,
    dialogSub: false,
    block_comment: '',
    block_comment_sub: '',
    selectedAnswer: null,
    answers_final: {},
    curators_final: {},
    ButtonEnabled: false,
    user_group: '',
    validIds: [],
    answerable: true,
  }),
  components: {
    FadeLoader
  },
  created() {
    this.init()
  },
  computed: {
    isSubprocessSended() {
      // Убедитесь, что allist и current_block_index корректно определены.
      if (!this.allist || !this.current_block_index || !this.current_subprocess_index) {
        return false;
      }

      // Получаем текущий блок и подпроцесс.
      const block = this.allist[this.current_block_index.id];
      if (!block || !block.subprocesses) {
        return false;
      }

      // Находим подпроцесс с текущим id.
      const subprocess = block.subprocesses.find(sp => sp.id === this.current_subprocess_index.id);
      // console.log(subprocess)
      // Проверяем, есть ли  поле sended и равно ли оно true.
      return subprocess?.sended === true;
    }
  },
  mounted(){
    this.user_id = this.$auth.user.user_id
    this.user_group = this.$auth.user.group[0].name
  },
  watch(){
    // console.log(this.current_subprocess_index.id)

  },
  methods: {
    handleFileUpload() {
      // Здесь можно добавить логику обработки файла перед отправкой
    },
    async send_review_back(){
      const formData = new FormData();
      // formData.append('ask', this.current_question_index.id);
      formData.append('ask', 1);
      // formData.append('fin', this.BankId);
      formData.append('fin', 1);
      formData.append('user', 4);
      // formData.append('critery', this.current_subprocess_index.id);
      formData.append('subprocess', this.current_subprocess_index.id);
      formData.append('reviewer_user', 7);
      formData.append('comment_answer', 'TestDarmen');
      formData.append('answerable', 1);
      const response = await this.$axios.post('https://srep.finreg.kz/api/answer-update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    async send_review() {
      const formData = new FormData();
      formData.append('fin', this.BankId);
      formData.append('user', this.user_id);
      formData.append('subprocess', this.current_subprocess_index.id);
      const response = await this.$axios.put('https://srep.finreg.kz/api/answers/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const blockId = this.current_block_index.id;
      const subprocessId = this.current_subprocess_index.id;

      // Находим индекс подпроцесса, который нужно удалить.
      const subprocessIndex = this.allist[blockId].subprocesses.findIndex(
          sp => sp.id === subprocessId
      );

      if (subprocessIndex !== -1) {
        // Удаляем подпроцесс и его вопросы.
        this.allist[blockId].subprocesses.splice(subprocessIndex, 1);
        // Обратите внимание, что это также удалит все вопросы, связанные с этим подпроцессом,
        // поскольку они являются частью объекта подпроцесса.

        // Теперь нам нужно обновить список, чтобы Vue отреагировал на эти изменения.
        this.allist[blockId].subprocesses = [...this.allist[blockId].subprocesses];

        // Вы можете выполнить дополнительные действия, например, отправить данные на сервер.
        // ...
      } else {
        // Обработка ситуации, если подпроцесс с нужным id не найден.
        console.error('Subprocess with the specified id not found');
      }
      // console.log(response)
    },
    onAnswerSelected(value) {
      // console.log(value)
      // Логика преобразования выбранного значения и обновление this.answers
      // value содержит выбранный key, и вы должны найти соответствующий obj.id для обновления answers
      // const criteriaId = this.currentCriteriaId; // предполагается, что у вас есть текущий ID критерия
      // this.answers[value] = criteriaId;
    },
    async saveValue() {
      // Здесь вы можете добавить логику для сохранения нового значения
      try {
        const response = await this.$axios.post('https://srep.finreg.kz/api/modal_block/', {
          fin: this.BankId,
          block: this.current_block_index.id,
          modal_block: this.block_comment
        })
      } catch (e) {
        console.log(e)
        this.snack = true
        this.snackColor = 'red'
        this.snackText = 'Комментарий не сохранён!'
      }
      this.snack = true
      this.snackColor = '#29537A'
      this.snackText = 'Сохранено!'
      this.dialog = false; // Закрыть диалог после сохранения
    },
    async saveValueSub() {
      // Здесь вы можете добавить логику для сохранения нового значения
      try {
        const response = await this.$axios.post('https://srep.finreg.kz/api/modal_subprocess/', {
          fin: this.BankId,
          subprocess: this.current_subprocess_index.id,
          modal_subprocess: this.block_comment_sub
        })
      } catch (e) {
        console.log(e)
        this.snack = true
        this.snackColor = 'red'
        this.snackText = 'Комментарий не сохранён!'
      }
      this.snack = true
      this.snackColor = '#29537A'
      this.snackText = 'Сохранено!'
      this.dialogSub = false; // Закрыть диалог после сохранения
    },
    async handleClick(question, sub, block) {
      this.current_question = question.position + ". " + question.ask

      const multiple = JSON.parse(question.multiply_choise)
      this.current_answer = multiple.map(obj => {
        return {key: obj.pk, value: obj.fields.choice};
      });

      this.current_subprocess_index = sub
      this.current_block_index = block
      this.current_question_index = question
      this.current_subprocess = sub.name
      this.block_comment = ''
      const response_init = await this.$axios.get('https://srep.finreg.kz/api/modal_block/', {
        params: {
          fin: this.BankId,
          block: this.current_block_index.id
        }
      })
      this.block_comment = response_init.data[0].modal_block
      const response_init_sub = await this.$axios.get('https://srep.finreg.kz/api/modal_subprocess/', {
        params: {
          fin: this.BankId,
          subprocess: this.current_subprocess_index.id
        }
      })
      this.block_comment_sub = response_init_sub.data[0].modal_subprocess
      this.answers_final = {}
      this.curators_final = {}
      this.main_answer = {}
      this.main_curator = {}
      this.answers = {}
      this.curators = {}
      this.criteries_count = Object.keys(question.criteries).length
      this.answerable = question.answerable
      const currentId = this.current_question_index.id;


      const groupData = this.answered_answersData[currentId];
      // Находим ответ, соответствующий текущему вопросу
      if (groupData && groupData.answers) {
        const foundAnswer = groupData.answers.find(answer => !answer.to_rew);
        if (foundAnswer) {

          // Установка текстового ответа для текущего куратора
          this.main_curator[currentId] = foundAnswer.text_answer;
          // Установка выбранного ответа для v-model, если он существует
          this.main_answer[currentId] = foundAnswer.answer.id;
        }
      }
      this.initializeSelectedAnswers()
      // this.current_question_index.criteries.forEach(criteria => {
      //   // Инициализация answers с дефолтным значением, возможно 'null' или соответствующим 'key'
      //   // const defaultAnswer = this.passtheMutiple(criteria).find(a => /* условие для определения дефолтного значения */);
      //   const defaultAnswer = this.passtheMutiple(criteria)[0]
      //   this.$set(this.answers, criteria.id, defaultAnswer ? defaultAnswer.key : null);
      // });
    },
    checkup() {
      console.log(this.validIds)
    },
    async saved() {
      if (!this.validIds.includes(this.current_question_index.id)) {
        this.validIds.push(this.current_question_index.id);
      }
      if (this.answer !== '') {

        if (this.criteries_count === 0 && this.answerable === true) {
          // const
          const formData = new FormData();
          formData.append('main_answer_file_', this.file);
          formData.append('main_answer_mch_', JSON.stringify(this.main_answer));
          formData.append('main_answer_text_', this.main_curator[this.current_question_index.id]);
          try {
            const response = await this.$axios.post('https://srep.finreg.kz/api/' + this.BankId + '/' + this.current_block_index.id + '/' + this.current_question_index.id, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            const au = response.data.is_last_unanswered_ask_subprocess
            if(au==true) {
              if (this.allist[this.current_block_index.id] && Array.isArray(this.allist[this.current_block_index.id].subprocesses)) {
                // Поиск индекса подпроцесса с нужным id.
                const subprocessIndex = this.allist[this.current_block_index.id].subprocesses.findIndex(
                    subprocess => subprocess.id === this.current_subprocess_index.id
                );

                // Проверка, что подпроцесс с таким id найден.
                if (subprocessIndex !== -1) {
                  // Добавление поля sended со значением true.
                  this.$set(this.allist[this.current_block_index.id].subprocesses[subprocessIndex], 'sended', true);
                } else {
                  // Обработка ситуации, если подпроцесс с нужным id не был найден.
                  console.error('Subprocess with the specified id not found');
                }
              } else {
                // Обработка ситуации, если блок не найден или не содержит подпроцессов.
                console.error('Block not found or does not contain any subprocesses');
              }
            }
            this.ButtonEnabled = au
            this.snack = true
            this.snackColor = '#29537A'
            this.snackText = 'Сохранено!'
            this.main_answer = {}
            this.main_curator = {}
            // вернуться
            const answered_answers = await this.$axios.get('https://srep.finreg.kz/api/get_answered/', {
              params: {
                fin_id: this.BankId,
                // reviewed: 'no'
              }
            })

            this.validIds = Object.keys(answered_answers.data.grouped_answers).map(Number);

            const groupedAnswers = answered_answers.data.grouped_answers;

// Создаем карту toRewMap для хранения статуса to_rew по каждому ask_id
            const toRewMap = new Map();

// Перебираем groupedAnswers, чтобы заполнить карту
            Object.entries(groupedAnswers).forEach(([askId, groupData]) => {
              // Если в answers есть хотя бы один элемент с to_rew: true, устанавливаем это значение в карту
              const toRewInAnswers = groupData.answers.some(answer => answer.to_rew);
              // Делаем то же самое для criteries
              const toRewInCriteries = groupData.criteries.some(critery => critery.to_rew);
              // Устанавливаем true, если любой to_rew в answers или criteries true
              if (toRewInAnswers || toRewInCriteries) {
                toRewMap.set(parseInt(askId), true);
              }
            });

// Фильтрация вопросов в allist, используя карту to_rew
            Object.keys(this.allist).forEach(blockKey => {
              const block = this.allist[blockKey];
              block.subprocesses = block.subprocesses.filter(subprocess => {
                // Удаляем subprocess, если он должен быть пересмотрен (to_rew === true)
                return subprocess.questions.every(question => !toRewMap.get(question.id));
              });
              // Удаляем блоки, у которых не осталось подпроцессов
              if (block.subprocesses.length === 0) {
                delete this.allist[blockKey];
              }
            });
            const currentId = this.current_question_index.id;
            this.answered_answersData = answered_answers.data.grouped_answers
            console.log(this.answered_answersData)
            const groupData = this.answered_answersData[currentId];

            // Если в группе есть ответы и они не подлежат пересмотру (to_rew === false)
            if (groupData && groupData.answers) {
              const foundAnswer = groupData.answers.find(answer => !answer.to_rew);

              if (foundAnswer) {
                // Установка текстового ответа для текущего куратора
                this.main_curator[currentId] = foundAnswer.text_answer;
                // Установка выбранного ответа для v-model, если он существует
                this.main_answer[currentId] = foundAnswer.answer.id;
              }
            }
            if (this.groupData && this.groupData.criteries) {
              this.groupData.criteries.forEach(critery => {
                if (!critery.to_rew) {
                  // Логика для обработки критериев, если это необходимо
                  // Например, если критерии должны быть отображены или использованы по-другому

                }
              })
            }
            this.initializeSelectedAnswers()
          } catch (e) {
            console.log(e)
          }
        } else if(this.criteries_count !== 0 && this.answerable === true){
          console.log('2 otveta')
          const formData = new FormData();
          formData.append('main_answer_file_', this.file);
          formData.append('main_answer_mch_', JSON.stringify(this.main_answer));
          formData.append('main_answer_text_', this.main_curator[this.current_question_index.id]);
          this.answers_final = {}
          this.curators_final = {}
          Object.keys(this.answers).forEach(key => {
            this.answers_final[`multiply_choice_for_${key}`] = this.answers[key];
          });
          this.curators_final = {};
          Object.keys(this.curators).forEach(key => {
            this.curators_final[`text_answer_${key}`] = this.curators[key];
          });
          Object.keys(this.answers_final).forEach(key => {
            formData.append(key, this.answers_final[key]);
          });
          Object.keys(this.curators_final).forEach(key => {
            formData.append(key, this.curators_final[key]);
          });
          try {
            const response = await this.$axios.post('https://srep.finreg.kz/api/' + this.BankId + '/' + this.current_block_index.id + '/' + this.current_question_index.id, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            const au = response.data.is_last_unanswered_ask_subprocess
            if(au==true) {
              if (this.allist[this.current_block_index.id] && Array.isArray(this.allist[this.current_block_index.id].subprocesses)) {
                // Поиск индекса подпроцесса с нужным id.
                const subprocessIndex = this.allist[this.current_block_index.id].subprocesses.findIndex(
                    subprocess => subprocess.id === this.current_subprocess_index.id
                );

                // Проверка, что подпроцесс с таким id найден.
                if (subprocessIndex !== -1) {
                  // Добавление поля sended со значением true.
                  this.$set(this.allist[this.current_block_index.id].subprocesses[subprocessIndex], 'sended', true);
                } else {
                  // Обработка ситуации, если подпроцесс с нужным id не был найден.
                  console.error('Subprocess with the specified id not found');
                }
              } else {
                // Обработка ситуации, если блок не найден или не содержит подпроцессов.
                console.error('Block not found or does not contain any subprocesses');
              }
            }
            this.ButtonEnabled = au
            this.snack = true
            this.snackColor = '#29537A'
            this.snackText = 'Сохранено!'
            this.main_answer = {}
            this.main_curator = {}
            // вернуться
            const answered_answers = await this.$axios.get('https://srep.finreg.kz/api/get_answered/', {
              params: {
                fin_id: this.BankId,
                // reviewed: 'no'
              }
            })

            this.validIds = Object.keys(answered_answers.data.grouped_answers).map(Number);

            const groupedAnswers = answered_answers.data.grouped_answers;

// Создаем карту toRewMap для хранения статуса to_rew по каждому ask_id
            const toRewMap = new Map();

// Перебираем groupedAnswers, чтобы заполнить карту
            Object.entries(groupedAnswers).forEach(([askId, groupData]) => {
              // Если в answers есть хотя бы один элемент с to_rew: true, устанавливаем это значение в карту
              const toRewInAnswers = groupData.answers.some(answer => answer.to_rew);
              // Делаем то же самое для criteries
              const toRewInCriteries = groupData.criteries.some(critery => critery.to_rew);
              // Устанавливаем true, если любой to_rew в answers или criteries true
              if (toRewInAnswers || toRewInCriteries) {
                toRewMap.set(parseInt(askId), true);
              }
            });

// Фильтрация вопросов в allist, используя карту to_rew
            Object.keys(this.allist).forEach(blockKey => {
              const block = this.allist[blockKey];
              block.subprocesses = block.subprocesses.filter(subprocess => {
                // Удаляем subprocess, если он должен быть пересмотрен (to_rew === true)
                return subprocess.questions.every(question => !toRewMap.get(question.id));
              });
              // Удаляем блоки, у которых не осталось подпроцессов
              if (block.subprocesses.length === 0) {
                delete this.allist[blockKey];
              }
            });
            const currentId = this.current_question_index.id;
            this.answered_answersData = answered_answers.data.grouped_answers
            console.log(this.answered_answersData)
            const groupData = this.answered_answersData[currentId];

            // Если в группе есть ответы и они не подлежат пересмотру (to_rew === false)
            if (groupData && groupData.answers) {
              const foundAnswer = groupData.answers.find(answer => !answer.to_rew);

              if (foundAnswer) {
                // Установка текстового ответа для текущего куратора
                this.main_curator[currentId] = foundAnswer.text_answer;
                // Установка выбранного ответа для v-model, если он существует
                this.main_answer[currentId] = foundAnswer.answer.id;
              }
            }
            if (this.groupData && this.groupData.criteries) {
              this.groupData.criteries.forEach(critery => {
                if (!critery.to_rew) {
                  // Логика для обработки критериев, если это необходимо
                  // Например, если критерии должны быть отображены или использованы по-другому

                }
              })
            }
            this.initializeSelectedAnswers()
          } catch (e) {
            console.log(e)
          }
        } else {
          this.answers_final = {}
          this.curators_final = {}
          Object.keys(this.answers).forEach(key => {
            this.answers_final[`multiply_choice_for_${key}`] = this.answers[key];
          });
          this.curators_final = {};
          Object.keys(this.curators).forEach(key => {
            this.curators_final[`text_answer_${key}`] = this.curators[key];
          });

          const formData = new FormData();
          Object.keys(this.answers_final).forEach(key => {
            formData.append(key, this.answers_final[key]);
          });
          Object.keys(this.curators_final).forEach(key => {
            formData.append(key, this.curators_final[key]);
          });
          // formData.append('text_answer_', this.curators);
          try {
            const response = await this.$axios.post('https://srep.finreg.kz/api/' + this.$route.query.id + '/' + this.current_block_index.id + '/' + this.current_question_index.id, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            this.snack = true
            this.snackColor = '#29537A'
            this.snackText = 'Сохранено!'
            const au = response.data.is_last_unanswered_ask_subprocess
            if(au==true) {
              if (this.allist[this.current_block_index.id] && Array.isArray(this.allist[this.current_block_index.id].subprocesses)) {
                // Поиск индекса подпроцесса с нужным id.
                const subprocessIndex = this.allist[this.current_block_index.id].subprocesses.findIndex(
                    subprocess => subprocess.id === this.current_subprocess_index.id
                );

                // Проверка, что подпроцесс с таким id найден.
                if (subprocessIndex !== -1) {
                  // Добавление поля sended со значением true.
                  this.$set(this.allist[this.current_block_index.id].subprocesses[subprocessIndex], 'sended', true);
                } else {
                  // Обработка ситуации, если подпроцесс с нужным id не был найден.
                  console.error('Subprocess with the specified id not found');
                }
              } else {
                // Обработка ситуации, если блок не найден или не содержит подпроцессов.
                console.error('Block not found or does not contain any subprocesses');
              }
            }
            // вернуться
            const answered_answers = await this.$axios.get('https://srep.finreg.kz/api/get_answered/', {
              params: {
                fin_id: this.BankId,
                // reviewed: 'no'
              }
            })

            this.validIds = Object.keys(answered_answers.data.grouped_answers).map(Number);

            const groupedAnswers = answered_answers.data.grouped_answers;

// Создаем карту toRewMap для хранения статуса to_rew по каждому ask_id
            const toRewMap = new Map();

// Перебираем groupedAnswers, чтобы заполнить карту
            Object.entries(groupedAnswers).forEach(([askId, groupData]) => {
              // Если в answers есть хотя бы один элемент с to_rew: true, устанавливаем это значение в карту
              const toRewInAnswers = groupData.answers.some(answer => answer.to_rew);
              // Делаем то же самое для criteries
              const toRewInCriteries = groupData.criteries.some(critery => critery.to_rew);
              // Устанавливаем true, если любой to_rew в answers или criteries true
              if (toRewInAnswers || toRewInCriteries) {
                toRewMap.set(parseInt(askId), true);
              }
            });

// Фильтрация вопросов в allist, используя карту to_rew
            Object.keys(this.allist).forEach(blockKey => {
              const block = this.allist[blockKey];
              block.subprocesses = block.subprocesses.filter(subprocess => {
                // Удаляем subprocess, если он должен быть пересмотрен (to_rew === true)
                return subprocess.questions.every(question => !toRewMap.get(question.id));
              });
              // Удаляем блоки, у которых не осталось подпроцессов
              if (block.subprocesses.length === 0) {
                delete this.allist[blockKey];
              }
            });
            const currentId = this.current_question_index.id;
            this.answered_answersData = answered_answers.data.grouped_answers
            console.log(this.answered_answersData)
            const groupData = this.answered_answersData[currentId];

            // Если в группе есть ответы и они не подлежат пересмотру (to_rew === false)
            if (groupData && groupData.answers) {
              const foundAnswer = groupData.answers.find(answer => !answer.to_rew);

              if (foundAnswer) {
                // Установка текстового ответа для текущего куратора
                this.main_curator[currentId] = foundAnswer.text_answer;
                // Установка выбранного ответа для v-model, если он существует
                this.main_answer[currentId] = foundAnswer.answer.id;
              }
            }
            if (this.groupData && this.groupData.criteries) {
              this.groupData.criteries.forEach(critery => {
                if (!critery.to_rew) {
                  // Логика для обработки критериев, если это необходимо
                  // Например, если критерии должны быть отображены или использованы по-другому

                }
              })
            }
            this.initializeSelectedAnswers()
          } catch (e) {
            console.log(e)
          }
        }
      } else {
        this.snack = true
        this.snackColor = 'red'
        this.snackText = 'Заполните поле ответа!'
      }
    },
    savedandgo() {
      if (!this.validIds.includes(this.current_question_index.id)) {
        this.validIds.push(this.current_question_index.id);
      }
      this.snack = true
      this.snackColor = '#29537A'
      this.snackText = 'Сохранено!'
      this.nextQuestion()
    },
    addAnsweredQuestion(questionId) {
      if (!this.validIds.includes(questionId)) {
        this.validIds.push(questionId);
      }
    },
    initializeSelectedAnswers() {
      // ... ваш предыдущий код для получения groupData и т.д.
      const currentId = this.current_question_index.id;
      const groupData = this.answered_answersData[currentId];

      console.log(currentId)
      console.log(groupData)
      this.current_question_index.criteries.forEach(criteria => {
        const foundAnswer = groupData.criteries.find(answer => answer.critery.id === criteria.id);

        if (foundAnswer) {
          // Убедитесь, что foundAnswer.critery.choice соответствует одному из значений key в items
          console.log(foundAnswer)
          const answerKey = this.getAnswerKeyForAutocomplete(foundAnswer.critery.choice, criteria);
          this.$set(this.answers, criteria.id, answerKey);
          this.$set(this.curators, criteria.id, foundAnswer.text_answer);
        } else {
          // Если предыдущий ответ не найден или не соответствует ключам из items, установить дефолтное значение
          // const defaultAnswer = this.passtheMutiple(criteria)[0];
          // this.$set(this.answers, criteria.id, defaultAnswer ? defaultAnswer.key : null);
          // this.$set(this.curators, criteria.id, '');
          console.log('Вопрос не найден')
        }
      });
    },
    getAnswerKeyForAutocomplete(choice, criteria) {
      const multiple = JSON.parse(criteria.multiply_choise);
      const foundItem = multiple.find(item => item.fields.choice === choice);
      return foundItem ? foundItem.pk.toString() : null;
    },
    passtheMutiple(criteria) {

      // const currentId = this.current_question_index.id;
      // // Находим ответ, соответствующий текущему вопросу
      // const groupData = this.answered_answersData[currentId];
      // // Находим ответ, соответствующий текущему вопросу
      // if (groupData && groupData.criteries) {
      //   const foundAnswer = groupData.criteries;
      //   if (foundAnswer) {
      //     const filteredAnswers = foundAnswer.filter(answer => answer.critery.id === criteria.id);
      //
      //     // Преобразование отфильтрованных данных для использования в v-autocomplete
      //     const items = filteredAnswers.map(answer => ({
      //       key: answer.critery.id,
      //       value: answer.critery.choice
      //     }));
      //     // console.log(items)
      //     // console.log(this.answers)
      //     return items;
      //   }
      // }


        // Этот код возвращает варианты выбора для v-autocomplete
      const multiple = JSON.parse(criteria.multiply_choise);
      return multiple.map(obj => ({
        key: obj.pk.toString(),
        value: obj.fields.choice
      }));


      // const multiple = JSON.parse(criteria.multiply_choise);
      // const items = multiple.map(obj => {
      //   return {key: obj.pk.toString(), value: obj.fields.choice, value_2: criteria.id.toString()};
      // });
      //
      // return items



    },
    async nextQuestion() {

      const subArray = this.allist[this.current_block_index.id].subprocesses

      let ourIndexSub = 0
      for (const subkey in subArray) {

        if (subArray[subkey].id === this.current_subprocess_index.id) {
          ourIndexSub = parseInt(subkey, 10);
          break;
        }
      }

      const arra = this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions

      let ourIndex = 0
      for (const key in arra) {

        if (arra[key].position === this.current_question_index.position) {
          ourIndex = parseInt(key, 10);
          break;
        }
      }

      try {
        this.current_question = this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions[ourIndex + 1].position + ". " +
            this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions[ourIndex + 1].ask

        this.current_question_index = this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions[ourIndex + 1]
        this.criteries_count = Object.keys(this.current_question_index.criteries).length
        this.answerable = this.current_question_index.answerable
        // console.log(this.answerable)
        const multiple = JSON.parse(this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions[ourIndex + 1].multiply_choise)
        this.current_answer = multiple.map(obj => {
          return {key: obj.pk, value: obj.fields.choice};
        });
        this.block_comment = ''
        const response_init = await this.$axios.get('https://srep.finreg.kz/api/modal_block/', {
          params: {
            fin: this.BankId,
            block: this.current_block_index.id
          }
        })
        this.block_comment = response_init.data[0].modal_block
        const response_init_sub = await this.$axios.get('https://srep.finreg.kz/api/modal_subprocess/', {
          params: {
            fin: this.BankId,
            subprocess: this.current_subprocess_index.id
          }
        })
        this.block_comment_sub = response_init_sub.data[0].modal_subprocess

        this.answers_final = {}
        this.curators_final = {}
        this.main_answer = {}
        this.main_curator = {}
        this.answers = {}
        this.curators = {}
        const currentId = this.current_question_index.id;

        // Находим ответ, соответствующий текущему вопросу
        const groupData = this.answered_answersData[currentId];
        // Находим ответ, соответствующий текущему вопросу
        if (groupData && groupData.answers) {
          const foundAnswer = groupData.answers.find(answer => !answer.to_rew);
          if (foundAnswer) {

            // Установка текстового ответа для текущего куратора
            this.main_curator[currentId] = foundAnswer.text_answer;
            // Установка выбранного ответа для v-model, если он существует
            this.main_answer[currentId] = foundAnswer.answer.id;
          }
        }
        // this.current_question_index.criteries.forEach(criteria => {
        //   // Инициализация answers с дефолтным значением, возможно 'null' или соответствующим 'key'
        //   // const defaultAnswer = this.passtheMutiple(criteria).find(a => /* условие для определения дефолтного значения */);
        //   const defaultAnswer = this.passtheMutiple(criteria)[0]
        //   this.$set(this.answers, criteria.id, defaultAnswer ? defaultAnswer.key : null);
        // });
        this.initializeSelectedAnswers()
      } catch (e) {
        console.log(e)
        this.snack = true
        this.snackColor = '#29537A'
        this.snackText = 'Это последний вопрос в блоке!'
      }

    },
    async prevQuestion() {

      const subArray = this.allist[this.current_block_index.id].subprocesses

      let ourIndexSub = 0
      for (const subkey in subArray) {

        if (subArray[subkey].id === this.current_subprocess_index.id) {
          ourIndexSub = parseInt(subkey, 10);
          break;
        }
      }

      const arra = this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions
      let ourIndex = 0
      for (const key in arra) {

        if (arra[key].position === this.current_question_index.position) {
          ourIndex = parseInt(key, 10);
          break;
        }
      }
      try {
        this.current_question = this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions[ourIndex - 1].position + ". " +
            this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions[ourIndex - 1].ask
        this.current_question_index = this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions[ourIndex - 1]
        this.criteries_count = Object.keys(this.current_question_index.criteries).length
        this.answerable = this.current_question_index.answerable
        const multiple = JSON.parse(this.allist[this.current_block_index.id].subprocesses[ourIndexSub].questions[ourIndex - 1].multiply_choise)
        this.current_answer = multiple.map(obj => {
          return {key: obj.pk, value: obj.fields.choice};
        });
        this.block_comment = ''
        const response_init = await this.$axios.get('https://srep.finreg.kz/api/modal_block/', {
          params: {
            fin: this.BankId,
            block: this.current_block_index.id
          }
        })
        this.block_comment = response_init.data[0].modal_block
        const response_init_sub = await this.$axios.get('https://srep.finreg.kz/api/modal_subprocess/', {
          params: {
            fin: this.BankId,
            subprocess: this.current_subprocess_index.id
          }
        })
        this.block_comment_sub = response_init_sub.data[0].modal_subprocess

        this.answers_final = {}
        this.curators_final = {}
        this.main_answer = {}
        this.main_curator = {}
        this.answers = {}
        this.curators = {}
        const currentId = this.current_question_index.id;

        // Находим ответ, соответствующий текущему вопросу
        const groupData = this.answered_answersData[currentId];
        // Находим ответ, соответствующий текущему вопросу
        if (groupData && groupData.answers) {
          const foundAnswer = groupData.answers.find(answer => !answer.to_rew);
          if (foundAnswer) {

            // Установка текстового ответа для текущего куратора
            this.main_curator[currentId] = foundAnswer.text_answer;
            // Установка выбранного ответа для v-model, если он существует
            this.main_answer[currentId] = foundAnswer.answer.id;
          }
        }
        // this.current_question_index.criteries.forEach(criteria => {
        //   // Инициализация answers с дефолтным значением, возможно 'null' или соответствующим 'key'
        //   // const defaultAnswer = this.passtheMutiple(criteria).find(a => /* условие для определения дефолтного значения */);
        //   const defaultAnswer = this.passtheMutiple(criteria)[0]
        //   this.$set(this.answers, criteria.id, defaultAnswer ? defaultAnswer.key : null);
        // });
        this.initializeSelectedAnswers()
      } catch (e) {
        console.log(e)
        this.snack = true
        this.snackColor = '#29537A'
        this.snackText = 'Это первый вопрос в блоке!'
      }
    },
    async init() {
      const bank = await this.$axios.get('https://srep.finreg.kz/api/get_bank/', {
        params: {
          bank_id: this.$route.query.id
        }
      })
      this.BankName = bank.data[0].name_fins
      this.BankId = bank.data[0].id
      const answered_answers = await this.$axios.get('https://srep.finreg.kz/api/get_answered/', {
        params: {
          fin_id: this.BankId,
          // reviewed: 'no'
        }
      })

      this.validIds = Object.keys(answered_answers.data.grouped_answers).map(Number);
      const myobj = await this.$axios.get('https://srep.finreg.kz/api/getall/')
      this.allist = myobj.data
      // const toRewMap = new Map(answered_answers.data.answers.map(answer => [answer.ask_id, answer.to_rew]));
      // // Фильтрация вопросов в allist, используя карту to_rew
      // Object.keys(this.allist).forEach(blockKey => {
      //   const block = this.allist[blockKey];
      //   // Фильтруем подпроцессы, удаляя те, где есть вопросы с to_rew === true
      //   block.subprocesses = block.subprocesses.filter(subprocess => {
      //     // Проверяем, есть ли вопросы в subprocess, которые нужно удалить.
      //     return !subprocess.questions.some(question => toRewMap.get(question.id));
      //   });
      // });
      const groupedAnswers = answered_answers.data.grouped_answers;

// Создаем карту toRewMap для хранения статуса to_rew по каждому ask_id
      const toRewMap = new Map();

// Перебираем groupedAnswers, чтобы заполнить карту
      Object.entries(groupedAnswers).forEach(([askId, groupData]) => {
        // Если в answers есть хотя бы один элемент с to_rew: true, устанавливаем это значение в карту
        const toRewInAnswers = groupData.answers.some(answer => answer.to_rew);
        // Делаем то же самое для criteries
        const toRewInCriteries = groupData.criteries.some(critery => critery.to_rew);
        // Устанавливаем true, если любой to_rew в answers или criteries true
        if (toRewInAnswers || toRewInCriteries) {
          toRewMap.set(parseInt(askId), true);
        }
      });

// Фильтрация вопросов в allist, используя карту to_rew
      Object.keys(this.allist).forEach(blockKey => {
        const block = this.allist[blockKey];
        block.subprocesses = block.subprocesses.filter(subprocess => {
          // Удаляем subprocess, если он должен быть пересмотрен (to_rew === true)
          return subprocess.questions.every(question => !toRewMap.get(question.id));
        });
        // Удаляем блоки, у которых не осталось подпроцессов
        if (block.subprocesses.length === 0) {
          delete this.allist[blockKey];
        }
      });

      // this.validIds = answered_answers.data.answers.filter(id => id !== null);
      // console.log(this.allist)
      const newData = this.allist
      if (this.user_group == 'reviewer') {
        // console.log('zashli')
        // Object.values(data).forEach((item) => {
        //   if (item.subprocesses && item.subprocesses.length) {
        //     item.subprocesses.forEach((subprocess) => {
        //       if (subprocess.questions && subprocess.questions.length) {
        //         // Фильтрация questions на основе validIds
        //         console.log('Valid IDs:', validIds);
        //         subprocess.questions.forEach(question => {
        //           console.log(`Question ID: ${question.id}, Present in validIds:`, validIds.includes(question.id));
        //         });
        //         subprocess.questions = subprocess.questions.filter(question => validIds.includes(question.id));
        //       }
        //     });
        //     item.subprocesses = item.subprocesses.filter(subprocess =>
        //         subprocess.questions && subprocess.questions.length > 0
        //     );
        //     item.subprocesses = item.subprocesses.filter(subprocess =>
        //         subprocess.questions && subprocess.questions.length > 0
        //     );
        //   }
        // });
        for (const key in newData) {
          if (newData.hasOwnProperty(key)) {
            const block = newData[key];
            if (block.subprocesses && block.subprocesses.length) {
              // Фильтруем вопросы в подпроцессах
              block.subprocesses.forEach(subprocess => {
                if (subprocess.questions && subprocess.questions.length) {
                  subprocess.questions = subprocess.questions.filter(question =>
                      validIds.includes(question.id)
                  );
                }
              });

              // Удаляем подпроцессы, которые теперь пусты
              block.subprocesses = block.subprocesses.filter(subprocess =>
                  subprocess.questions && subprocess.questions.length > 0
              );
            }

            // Если у блока не осталось подпроцессов, удаляем и сам блок
            if (block.subprocesses.length === 0) {
              delete newData[key];
            }
          }
        }
        this.allist = newData
      }

      this.current_question = this.allist[1].subprocesses[0].questions[0].position + ". " + this.allist[1].subprocesses[0].questions[0].ask
      this.current_subprocess = this.allist[1].subprocesses[0].name

      const multiple = JSON.parse(this.allist[1].subprocesses[0].questions[0].multiply_choise)
      this.current_answer = multiple.map(obj => {
        return {key: obj.pk, value: obj.fields.choice};
      });
      this.current_question_index = this.allist[1].subprocesses[0].questions[0]
      this.current_subprocess_index = this.allist[1].subprocesses[0]
      this.current_block_index = this.allist[1]
      this.criteries_count = Object.keys(this.current_question_index.criteries).length
      this.answerable = this.current_question_index.answerable
      try {
        const response_init = await this.$axios.get('https://srep.finreg.kz/api/modal_block/', {
          params: {
            fin: this.BankId,
            block: this.current_block_index.id
          }
        })
        this.block_comment = response_init.data[0].modal_block
        const response_init_sub = await this.$axios.get('https://srep.finreg.kz/api/modal_subprocess/', {
          params: {
            fin: this.BankId,
            subprocess: this.current_subprocess_index.id
          }
        })
        this.block_comment_sub = response_init_sub.data[0].modal_subprocess
      } catch (e) {
        console.log(e)
      }
      const currentId = this.current_question_index.id;

      // // Находим ответ, соответствующий текущему вопросу
      // this.answered_to_vmodel = answered_answers.data
      // const foundAnswer = this.answered_to_vmodel.answers.find(answer => answer.ask_id === currentId && answer.to_rew === false);
      //
      //
      // if (foundAnswer) {
      //   this.main_curator[currentId] = foundAnswer.text_answer
      //   // Установка выбранного ответа для v-model, если он существует
      //   this.main_answer[currentId] = foundAnswer.answer.id;
      // }
      // Находим группу ответов, соответствующую текущему вопросу
      this.answered_answersData = answered_answers.data.grouped_answers
      console.log(this.answered_answersData)
      const groupData = this.answered_answersData[currentId];

      // Если в группе есть ответы и они не подлежат пересмотру (to_rew === false)
      if (groupData && groupData.answers) {
        const foundAnswer = groupData.answers.find(answer => !answer.to_rew);

        if (foundAnswer) {
          // Установка текстового ответа для текущего куратора
          this.main_curator[currentId] = foundAnswer.text_answer;
          // Установка выбранного ответа для v-model, если он существует
          this.main_answer[currentId] = foundAnswer.answer.id;
        }
      }
      if (this.groupData && this.groupData.criteries) {
        this.groupData.criteries.forEach(critery => {
          if (!critery.to_rew) {
            // Логика для обработки критериев, если это необходимо
            // Например, если критерии должны быть отображены или использованы по-другому

          }
        })
      }
      this.initializeSelectedAnswers()
      // this.current_question_index.criteries.forEach(criteria => {
      //   // Инициализация answers с дефолтным значением, возможно 'null' или соответствующим 'key'
      //   // const defaultAnswer = this.passtheMutiple(criteria).find(a => /* условие для определения дефолтного значения */);
      //   const defaultAnswer = this.passtheMutiple(criteria)[0]
      //   this.$set(this.answers, criteria.id, defaultAnswer ? defaultAnswer.key : null);
      // });
      this.loading = false
      //       .save {
      //     color: #4c4c4c;
      //   }
      //
      // .save:hover {
      //     color: white;
      //     background-color: #4c4c4c;
      //   }
    }
  },
}
</script>

<style scoped>
.row--dense > .col, .row--dense > [class*=col-] {
  padding: 0;
}

.custom-table {
  border: 1px solid #ccc;
}

.saveandgo {
  color: #29537A;
}

.saveandgo:hover {
  color: white;
  background-color: #29537A;
}

.save {
  color: #4c4c4c;
  position: relative; /* Для позиционирования прогресс-бара */
  overflow: hidden; /* Скрывать часть прогресс-бара, выходящую за границы */
}

.save:hover {
  color: white;
  background-color: #4c4c4c;
}

.custom-list-item {
  line-height: 1;
}

.v-list-item-custom {
  min-height: 35px;
}

.item-title:hover {
  overflow: visible;
  white-space: normal;
  text-overflow: initial;
  font-size: 16px;
}

.item-title {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s;
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
.custom-width {
  width: 100px; /* Замените на нужную вам ширину */
}
.col-lg-9 {
  flex: 0 0 80%!important;
  max-width: 80%!important;
}
.col-lg-3 {
  flex: 0 0 20%!important;
  max-width: 20%!important;
}
</style>
