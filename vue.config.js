module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? './' // prod
        : '/', // dev
    devServer: {
        proxy: 'http://digitalization.student.smartworld.team:2280'
        // https: true
    }
}