// import { Injectable } from '@nestjs/common';
// import * as natural from 'natural';

// @Injectable()
// export class SentimentAnalysisService {
//   private analyzer: natural.SentimentAnalyzer;
//   private stemmer: natural.Stemmer;

//   constructor() {
//     this.stemmer = natural.PorterStemmerRu;
//     this.analyzer = new natural.SentimentAnalyzer(
//      "English"
//       this.stemmer,
//       'afinn',
//     );
//   }

//   analyzeText(text: string): string {
//     const score = this.analyzer.getSentiment(text.split(' '));
//     return this.interpretSentiment(score);
//   }

//   private interpretSentiment(score: number): string {
//     if (score > 0.5) return 'Strongly Positive';
//     if (score > 0) return 'Positive';
//     if (score === 0) return 'Neutral';
//     if (score > -0.5) return 'Negative';
//     return 'Strongly Negative';
//   }
// }

// import { Injectable } from '@nestjs/common';
// import * as natural from 'natural';
// import { data } from './data';

// @Injectable()
// export class SentimentAnalysisService {
//   private classifier: natural.BayesClassifier;

//   constructor() {
//     this.classifier = new natural.BayesClassifier(natural.PorterStemmerRu);
//     this.trainClassifier();
//   }

//   private trainClassifier(): void {
//     data.good.forEach((text) => {
//       this.classifier.addDocument(text, 'good');
//     });

//     data.neutral.forEach((text) => {
//       this.classifier.addDocument(text, 'neutral');
//     });

//     data.bad.forEach((text) => {
//       this.classifier.addDocument(text, 'bad');
//     });

//     console.log('classifier', this.classifier);

//     this.classifier.train();
//   }

//   classifyText(text: string): string {
//     return this.classifier.classify(text);
//   }

//   testClassifier(text: string) {
//     return this.classifyText(text);
//   }
// }

import { Injectable } from '@nestjs/common';
import * as natural from 'natural';
import * as xlsx from 'xlsx';
import { data } from './data';

@Injectable()
export class SentimentAnalysisService {
  private classifier: natural.BayesClassifier;
  private stopwords = [
    'и',
    'в',
    'во',
    'не',
    'что',
    'он',
    'на',
    'я',
    'с',
    'со',
    'как',
    'а',
    'то',
    'все',
    'она',
    'так',
    'его',
    'но',
    'да',
    'ты',
    'к',
    'у',
    'же',
    'вы',
    'за',
    'бы',
    'по',
    'только',
    'ее',
    'мне',
    'было',
    'вот',
    'от',
    'меня',
    'еще',
    'нет',
    'о',
    'из',
    'ему',
    'теперь',
    'когда',
    'даже',
    'ну',
    'вдруг',
    'ли',
    'если',
    'уже',
    'или',
    'ни',
    'быть',
    'был',
    'него',
    'до',
    'вас',
    'нибудь',
    'опять',
    'уж',
    'вам',
    'ведь',
    'там',
    'потом',
    'себя',
    'ничего',
    'ей',
    'может',
    'они',
    'тут',
    'где',
    'есть',
    'надо',
    'ней',
    'для',
    'мы',
    'тебя',
    'их',
    'чем',
    'была',
    'сам',
    'чтоб',
    'без',
    'будто',
    'чего',
    'раз',
    'тоже',
    'себе',
    'под',
    'будет',
    'ж',
    'тогда',
    'кто',
    'этот',
    'того',
    'потому',
    'этого',
    'какой',
    'совсем',
    'ним',
    'здесь',
    'этом',
    'один',
    'почти',
    'мой',
    'тем',
    'чтобы',
    'нее',
    'сейчас',
    'были',
    'куда',
    'зачем',
    'всех',
    'никогда',
    'можно',
    'при',
    'наконец',
    'два',
    'об',
    'другой',
    'хоть',
    'после',
    'над',
    'больше',
    'тот',
    'через',
    'эти',
    'нас',
    'про',
    'всего',
    'них',
    'какая',
    'много',
    'разве',
    'три',
    'эту',
    'моя',
    'впрочем',
    'хорошо',
    'свою',
    'этой',
    'перед',
    'иногда',
    'лучше',
    'чуть',
    'том',
    'нельзя',
    'такой',
    'им',
    'более',
    'всегда',
    'конечно',
    'всю',
    'между',
  ];

  constructor() {
    this.classifier = new natural.BayesClassifier(natural.PorterStemmerRu);

    this.loadDataAndTrainClassifier();
  }

  private loadDataAndTrainClassifier(): void {
    const workbook = xlsx.readFile('src/train-data/train_data.xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const trainData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    if (trainData) {
      trainData.forEach((row: any[]) => {
        const text = row[0];
        const score = row[1];
        const sentiment = this.convertScoreToSentiment(score);
        if (sentiment && text) {
          this.classifier.addDocument(text, sentiment);
        }
      });
    }

    data.good.forEach((text) => {
      this.classifier.addDocument(text, 'good');
    });

    data.neutral.forEach((text) => {
      this.classifier.addDocument(text, 'neutral');
    });

    data.bad.forEach((text) => {
      this.classifier.addDocument(text, 'bad');
    });

    // const workbook2 = xlsx.readFile('src/train-data/train_data_2.xlsx');
    // const sheetName2 = workbook2.SheetNames[0];
    // const sheet2 = workbook2.Sheets[sheetName2];
    // const data2 = xlsx.utils.sheet_to_json(sheet2, { header: 1 }); // Используйте header:1 для получения данных в виде массива массивов

    // if (data2) {
    //   data2.forEach((row: any[]) => {
    //     const text = row[0]; // Текст для классификации - первый элемент массива
    //     const score = row[1]; // Теперь score - это второй элемент массива
    //     const sentiment = this.convertScoreToSentiment(score);
    //     if (sentiment && text) {
    //       this.classifier.addDocument(text, sentiment);
    //     }
    //   });
    // }

    this.classifier.train();
  }

  private convertScoreToSentiment(score: number): string | null {
    if (score >= 1) return 'good';
    if (score <= -1) return 'bad';
    if (score === 0) return 'neutral';
    return null;
  }

  classifyText(text: string): string {
    // Токенизация текста

    const tokenizer = new natural.AggressiveTokenizerRu();
    const tokens = tokenizer.tokenize(text);
    console.log('Tokens:', tokens);

    const dictionary = [
      'ужасный',
      'товар',
      'для',
      'людей',
      'хороший',
      'плохой',
      'качество',
      'цена',
      'отличный',
      'продукт',
      'обслуживание',
      'момент',
    ];

    const spellcheck = new natural.Spellcheck(dictionary);
    const correctedTokens = tokens.map((token) => {
      const correction = spellcheck.getCorrections(token, 1)[0];
      return correction ? correction : token;
    });
    console.log('Corrected Tokens:', correctedTokens);

    // Стемминг токенов
    const stemmer = natural.PorterStemmerRu;
    const stemmedTokens = correctedTokens.map((token) => stemmer.stem(token));
    console.log('Stemmed Tokens:', stemmedTokens);

    const filteredTokens = stemmedTokens.filter(
      (token) => !this.stopwords.includes(token),
    );
    console.log('Filtered Tokens:', filteredTokens);

    // Объединение стеммированных токенов обратно в строку для классификации
    const processedText = filteredTokens.join(' ');
    console.log('Processed Text:', processedText);

    // Классификация обработанного текста
    return this.classifier.classify(processedText);
  }

  // Тестовый метод остается без изменений
  testClassifier() {
    const textData = [
      // ['Мужчина выступил на конференции', 0],
      // ['Очень плохой человек', -1],
      // ['Ребята рад вас видеть', 1],
      // [
      //   'Губернатор Ульяновской области Сергей Морозов предложил своим подчиненным пересесть на автомобили марки «Лада» и УАЗ. К этому он призвал, в частности, глав районов области в своем твиттере.',
      //   -1,
      // ],
      // [
      //   'Необходимость использования продукции отечественного автопрома в служебных целях Морозов объяснил тем, что госслужащим надо быть «поскромнее». Губернатор также попросил руководителя своего аппарата Светлану Опенышеву ограничить максимальную стоимость автомобилей для подчиненных.',
      //   -1,
      // ],
      // [
      //   'Опенышева, в свою очередь, написала в микроблоге, что все чиновники Ульяновской области уже поддерживают российский автопром. Автомобили Toyota Camri, Skoda и Hyundai, по ее словам, собираются в России. Используют ли ульяновские чиновники исключительно такие машины, Опенышева не уточнила.',
      //   -1,
      // ],
      // [
      //   'Сам губернатор Морозов использует в служебных целях автомобиль Mercedes-Benz S350. Летом 2012 года машину губернатора заметили и сфотографировали припаркованной на стоянке для инвалидов. Морозов тогда сообщил, что готов оплатить полагающийся в таком случае штраф, и обещал провести разъяснительную беседу со своими водителями.',
      //   -1,
      // ],
      // ['Плохо', -1],
      // ['Очень круто', 1],
      // ['Очень круто', 1],
      // ['Очень круто', 1],
      // ['идиот', -1],
      // ['Очень круто собака', 1],
      // ['Очень плохо', -1],
      // ['Очень круто', 1],
      // ['Не очень круто', -1],
      ['малый', 0],
    ];

    // return this.classifyText(text);

    return this.evaluateMetrics(textData);
  }

  evaluateMetrics(testData: any[]): any {
    let truePositive = 0;
    let trueNegative = 0;
    let falsePositive = 0;
    let falseNegative = 0;

    testData.forEach((row: any[]) => {
      const text = row[0];
      const actualSentiment = this.convertScoreToSentiment(row[1]);
      const predictedSentiment = this.classifyText(text);

      if (predictedSentiment === 'good' && actualSentiment === 'good') {
        truePositive++;
      } else if (predictedSentiment === 'bad' && actualSentiment === 'bad') {
        trueNegative++;
      } else if (predictedSentiment === 'good' && actualSentiment !== 'good') {
        falsePositive++;
      } else if (predictedSentiment === 'bad' && actualSentiment !== 'bad') {
        falseNegative++;
      }
    });

    const precision = truePositive / (truePositive + falsePositive);
    const recall = truePositive / (truePositive + falseNegative);
    const f1Score = (2 * (precision * recall)) / (precision + recall);
    const accuracy = (truePositive + trueNegative) / testData.length;

    return {
      precision,
      recall,
      f1Score,
      accuracy,
      truePositive,
      trueNegative,
      falsePositive,
      falseNegative,
    };
  }

  // calculateMetrics(testData) {
  //   let truePositive = 0;
  //   let falsePositive = 0;
  //   let falseNegative = 0;
  //   let trueNegative = 0;

  //   testData.forEach((item) => {
  //     const predicted = this.classifyText(item.text);
  //     const actual = item.sentiment;

  //     if (predicted === 'good' && actual === 'good') truePositive++;
  //     else if (predicted === 'good' && actual !== 'good') falsePositive++;
  //     else if (predicted !== 'good' && actual === 'good') falseNegative++;
  //     else trueNegative++;
  //   });

  //   const precision = truePositive / (truePositive + falsePositive);
  //   const recall = truePositive / (truePositive + falseNegative);
  //   const f1Score = (2 * (precision * recall)) / (precision + recall);
  //   const accuracy = (truePositive + trueNegative) / testData.length;

  //   return { precision, recall, f1Score, accuracy };
  // }
}
