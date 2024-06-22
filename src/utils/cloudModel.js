import * as tf from '@tensorflow/tfjs';

class CloudModel {
  constructor() {
    this.model = null;
    this.createModel();
  }

  createModel() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [5] }));
    this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
    this.model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });
  }

  async train(features, labels) {
    const xs = tf.tensor2d(features);
    const ys = tf.tensor2d(labels);

    await this.model.fit(xs, ys, {
      epochs: 50,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
        },
      },
    });

    xs.dispose();
    ys.dispose();
  }

  predict(features) {
    const input = tf.tensor2d([features]);
    const prediction = this.model.predict(input);
    const result = prediction.dataSync()[0];
    input.dispose();
    prediction.dispose();
    return result;
  }
}

export default CloudModel;