const puntosTier = {
    "LT5": 1, "HT5": 2, "LT4": 3, "HT4": 4,
    "LT3": 6, "HT3": 10, "LT2": 16, "HT2": 28,
    "LT1": 44, "HT1": 60
};

function cargarRanking() {
    fetch("/static/ranking.json")
        .then(res => {
            if (!res.ok) throw new Error("No se pudo cargar ranking.json");
            return res.json();
        })
        .then(data => {
            const usuarios = data.usuarios;
            const rankingArray = [];

            for (let id in usuarios) {
                const user = usuarios[id];
                let modalidadesStr = "";
                let puntosTotales = 0;

                for (let modalidad in user) {
                    if (modalidad !== "discord_name") {
                        const tier = user[modalidad];
                        puntosTotales += puntosTier[tier] || 0;
                        modalidadesStr += `${modalidad}: ${tier}, `;
                    }
                }

                modalidadesStr = modalidadesStr.slice(0, -2);
                rankingArray.push({
                    nombre: user.discord_name,
                    modalidades: modalidadesStr,
                    puntos: puntosTotales
                });
            }

            rankingArray.sort((a, b) => b.puntos - a.puntos);

            const tbody = document.querySelector("#ranking-table tbody");
            tbody.innerHTML = "";

            rankingArray.forEach((user, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.nombre}</td>
                    <td>${user.modalidades}</td>
                    <td>${user.puntos}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error("Error cargando ranking.json:", err));
}

document.addEventListener("DOMContentLoaded", cargarRanking);
