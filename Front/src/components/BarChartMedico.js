import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from 'react';
import axios from "axios";
import { CircularProgress } from '@mui/material';


const BarChartGestor = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState('');
  useEffect(() => {
    // Simule uma atualização de dados quando um novo valor é recebido
    const fetchData = async () => {
      const array = new Array(12).fill(0);
      const rg = await localStorage.getItem('rg')
      // Substitua isso pela lógica de busca de dados real
      // Fetch data using Axios
      await axios.get(`http://localhost:8080/atestado/medico/getdata/${rg}`)
        .then(response => {
          const data1 = response.data
          const tamanho = data1.length
          for (let i = 0; i < tamanho; i++) {
            const mes = data1[i].mes
            const ocorrencias = data1[i].total_ocorrencias
            if(data1[i].ano === '2023'){
              array[mes - 1] = ocorrencias
            } else {
              array[mes - 1] = 0
            }
          }
          const labels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
          const data = {
            labels: labels,
            datasets: [
              {
                label: "Atestados emitidos no mês",
                backgroundColor: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)", "rgb(0, 255, 255)", "rgb(255, 0, 255)", "rgb(255, 165, 0)", "rgb(255, 192, 203)", "rgb(128, 0, 128)", "rgb(139, 69, 19)", "rgb(128, 128, 128)", "rgb(0, 0, 0)"],
                borderColor: "rgb(255, 99, 132)",
                data: array,
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
        (<Bar data={items} />)}
    </div>
  );
};

export default BarChartGestor;