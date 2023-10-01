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
            await axios.get(`https://gestaoatestadoback.onrender.com/atestado/medico/getcids/${rg}`)
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
                                backgroundColor: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)", "rgb(0, 255, 255)", "rgb(255, 0, 255)", "rgb(255, 165, 0)", "rgb(255, 192, 203)", "rgb(128, 0, 128)", "rgb(139, 69, 19)", "rgb(128, 128, 128)", "rgb(0, 0, 0)"],
                                borderColor: "rgb(255, 99, 132)",
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