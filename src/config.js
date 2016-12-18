export default {
    nodeEnv: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 9000,
    mongo: () => {
        const useReplicaSet = process.env.MONGODB_REPL_SET || false;
        const hostA = process.env.MONGODB_A || 'localhost';
        const hostB = process.env.MONGODB_B || 'localhost';
        const port = process.env.MONGODB_PORT || 27017;
        const dataBaseName = 'expressApi';

        let uri = `${hostA}:${port}/${dataBaseName}`;

        if(useReplicaSet){
            uri = `${hostA}:${port},${hostB}:${port}/${dataBaseName}`;
        }

        return {
            uri: uri
        };
    },
    jwt: {
        secret: 'jwt@s3cr3T',
        expiresIn: '8h'
    },
    monthNames: [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro'
    ],
    matchs: {
        email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    }
};
