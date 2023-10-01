import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

const PieChart = () => {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState('');
    useEffect(() => {
        // Simule uma atualização de dados quando um novo valor é recebido
        const fetchData = async () => {
            const arrayData = new Array(5).fill(0);
            const arrayLabel = new Array(5).fill(0);
            const rg = await localStorage.getItem('rg')
            // Substitua isso pela lógica de busca de dados real

            // Fetch data using Axios
            await axios.get(`http://localhost:8080/atestado/medico/getcids/${rg}`)
                .then(response => {
                    const data1 = response.data
                    const tamanho = data1.length
                    for (let i = 0; i < tamanho; i++) {
                        const cid = data1[i].cid_especificado
                        const ocorrencias = data1[i].quantidade
                        arrayData[i] = ocorrencias
                        arrayLabel[i] = cid
                    }
                    const labels = arrayLabel;
                    const data = {
                        labels: labels,
                        datasets: [
                            {
                                label: "Repetição do cid",
                                backgroundColor: [            'rgb(255, 0, 0)',    // Cor 1 (Vermelho)
                                'rgb(0, 255, 0)',    // Cor 2 (Verde)
                                'rgb(0, 0, 255)',    // Cor 3 (Azul)
                                'rgb(255, 255, 0)',  // Cor 4 (Amarelo)
                                'rgb(128, 0, 128)'   // Cor 5 (Roxo)
                            ],
                                data: arrayData,
                            },
                        ],
                    };
                    setItems(data)
                    setLoading(false)
                })
                .catch(error => {
                    console.error('Erro ao buscar atestado:', error);
                    setLoading(false);
                })
        };

        // Chame a função fetchData quando um novo valor é recebido
        fetchData();
    }, []);
    return (
        <div>
            {loading ? (<CircularProgress size={80} style={{ margin: 'auto', display: 'block' }} />)
        :
            (<Pie data={items} />)}
        </div>
    );
};
export default PieChart;