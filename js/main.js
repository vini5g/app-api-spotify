
class APIController {
    constructor () {
        this.clientId = '4088f0893688439295aee404c5add158';
        this.clientSecret = '7037012ca20f492982126eb5c319aada';
    }

    async getToken() {
        const result = await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
            }
        })
        .then(res => res.data.access_token)
        .catch(err => err);
        
        console.log(result);
        return result;
    }

    async getCategoria(token) {
        const result = await axios.get(`https://api.spotify.com/v1/browse/categories?locale=sv_BR&limit=10`, {
            headers: { 
                Authorization: 'Bearer ' + token
            }
        })
        .then(res => res.data.categories.items)
        .catch(err => err)

        return result;
    }

    async getPlaylistPorGenero(token, generoId)  {
        const limit = 10;
        
        const result = await axios.get(`https://api.spotify.com/v1/browse/categories/${generoId}/playlists?country=BR&limit=${limit}`, {
            headers: { 
                Authorization: 'Bearer ' + token
            }
        })
        .then(res => res.data.playlists.items)
        .catch(err => err)

        return result;
    }

    async getPlaylist(token, playlistId) {
        const result = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { 
                Authorization: 'Bearer ' + token
            }
        })
        .then(res => res.data)
        .catch(err => err)

        return result
    }

    async getMusicas(token, playlist_id) {
        const result = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?limit=10`, {
            headers: { 
                Authorization: 'Bearer ' + token
            }
        })
        .then(res => res.data.items)
        .catch(err => err)

        return result;
    }

}

class UIController {
    constructor() {
        this.DOMElements = {
            selectGenre: '#select_genre',
            selectPlaylist: '#select_playlist',
            frmPesquisar: '#frm_pesquisar',
            divCard: '#top_Playlists',
            divSonglist: '.song-list',
            player: '#player',
        }
    }

    inputField() {
        return {
            genre: document.querySelector(this.DOMElements.selectGenre),
            playlist: document.querySelector(this.DOMElements.selectPlaylist),
            frmPesquisar: document.querySelector(this.DOMElements.frmPesquisar)
        }
    }

    createGenero(text, value) {
        const html = `<option value="${value}">${text}</option>`;
        document.querySelector(this.DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
    }

    createPlaylist(text, value) {
        const html = `<option value="${value}">${text}</option>`;
        document.querySelector(this.DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
    }

    createCard(img,title,text) {
        const ulPlaylist = document.querySelector(this.DOMElements.divCard)
        ulPlaylist.innerHTML = '';
        const html = 
        `
        <div class="card">
            <img class="card-img-top" src="${img}" alt="${title}">
            <div class="card-body">
            <h3 class="card-title">${title}</h3>
            <p class="card-text">${text}</p>
            </div>
        </div>
        `
        ulPlaylist.innerHTML = html;
    }

    createTracks(id, name) {
        const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
        document.querySelector(this.DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
    }

    createPlayer(url) {
        const player = document.querySelector(this.DOMElements.player)
        player.innerHTML = '';
        const html = 
        `
        <audio controls autoplay name="media" style="width:100%;">
            <source src="${url}" type="audio/mpeg">
        </audio>
        `
        player.innerHTML = html
    }
  
  
    createGrafico(musicas) {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(desenharGrafico);
        function desenharGrafico() {
            
            var musica1 = {
                nomemusica: musicas[0].track.name,
                popularidade: musicas[0].track.popularity
            };
        
            var musica2 = {
                nomemusica: musicas[1].track.name,
                popularidade: musicas[1].track.popularity
            };
        
            var musica3 = {
                nomemusica: musicas[2].track.name,
                popularidade: musicas[2].track.popularity
            };
        
            var musica4 = {
                nomemusica: musicas[3].track.name,
                popularidade: musicas[3].track.popularity
            };
        
            var musica5 = {
                nomemusica: musicas[4].track.name,
                popularidade: musicas[4].track.popularity
            };
            var musica6 = {
                nomemusica: musicas[5].track.name,
                popularidade: musicas[5].track.popularity
            };
            var musica7 = {
                nomemusica: musicas[6].track.name,
                popularidade: musicas[6].track.popularity
            };
            var musica8 = {
                nomemusica: musicas[7].track.name,
                popularidade: musicas[7].track.popularity
            };
        
            console.log(musica1);

            

            var tabela = new google.visualization.DataTable();
            tabela.addColumn('string','categorias');
            tabela.addColumn('number','Popularidade');
            tabela.addRows([
                [musica1.nomemusica, musica1.popularidade],
                [musica2.nomemusica, musica2.popularidade],
                [musica3.nomemusica, musica3.popularidade],
                [musica4.nomemusica, musica4.popularidade],
                [musica5.nomemusica, musica5.popularidade],
                [musica5.nomemusica, musica6.popularidade],
                [musica7.nomemusica, musica7.popularidade],
                [musica8.nomemusica, musica8.popularidade],
            ]);

            var view = new google.visualization.DataView(tabela);
            view.setColumns([0, 1,
                            { calc: "stringify",
                                sourceColumn: 1,
                                type: "string",
                                role: "annotation"}]);
        
            var opcoes = {
                'title':'Popularidade das músicas',
                'height': 600,
            }

            var grafico = new google.visualization.BarChart(document.getElementById('grafico_mais_ouvidas'));
            grafico.draw(tabela, opcoes);  
        }  
    }
}

class APPController{
    constructor(UICtrl, APICtrl){
        this.APICtrl = APICtrl;
        this.UICtrl = UICtrl;
        this.musicas = [];
        this.playlist = '';
    }

    start() {
        console.log("O brabo está rodando");
        this.load();
    }

    async load() {
        const DOMInputs = this.UICtrl.inputField();
        const token = await this.APICtrl.getToken();
        localStorage.setItem('token', token);
        const genres = await APICtrl.getCategoria(token);
        genres.forEach(element => this.UICtrl.createGenero(element.name, element.id));

        DOMInputs.genre.addEventListener('change', async (e) => {
            e.preventDefault();
            DOMInputs.playlist.innerHTML = '';
            const generoSelect = this.UICtrl.inputField().genre;       
            const genreId = generoSelect.options[generoSelect.selectedIndex].value; 
            const playlist = await this.APICtrl.getPlaylistPorGenero(token, genreId); 
            this.playlist = playlist[0].id;
            playlist.forEach(p => {
                UICtrl.createPlaylist(p.name, p.id)
            });      
        });

        DOMInputs.playlist.addEventListener('change', (e) => {
            e.preventDefault();
            
            const playlistSelect = this.UICtrl.inputField().playlist;       
            const playlistId = playlistSelect.options[playlistSelect.selectedIndex].value;
            console.log(playlistId)
            this.playlist = playlistId;
        })
         
        DOMInputs.frmPesquisar.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log(this.playlist.length)

            const newtoken = await this.APICtrl.getToken();
            localStorage.setItem('token', token);

            document.querySelector(this.UICtrl.DOMElements.divCard).innerHTML = '';
            document.querySelector(this.UICtrl.DOMElements.divSonglist).innerHTML = '';
            document.querySelector(this.UICtrl.DOMElements.player).innerHTML = '';

            document.querySelector(this.UICtrl.DOMElements.divCard).innerHTML = 
            '<img class="w-100" src="./assets/0_BaN9eXoTV-r1AKge.gif" alt="carregando"/>';

            document.querySelector(this.UICtrl.DOMElements.divSonglist).innerHTML = 
            '<img class="w-100" src="./assets/0_BaN9eXoTV-r1AKge.gif" alt="carregando"/>';
    
            this.musicas = [];

            const playlist = await this.APICtrl.getPlaylist(newtoken, this.playlist);
            this.musicas = await this.APICtrl.getMusicas(newtoken, this.playlist);
            document.querySelector(this.UICtrl.DOMElements.divCard).innerHTML = ''
            document.querySelector(this.UICtrl.DOMElements.divSonglist).innerHTML = ''
            for (const musica of this.musicas) {
                this.UICtrl.createTracks(musica.track.id, musica.track.name);
            }

            const [{url}] = playlist.images;
            this.UICtrl.createCard(url, playlist.name, playlist.description);
            console.log(this.musicas);
            this.UICtrl.createGrafico(this.musicas);
        })

        const btnMusica = document.querySelector(this.UICtrl.DOMElements.divSonglist);
        btnMusica.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log(e);
            const {id} = e.target;
            const musica = this.musicas.find(item => {
                if (item.track.id == id) return item;
            })
            const {preview_url} = musica.track;
            
            if (preview_url == null) return alert('não foi possível reproduzir o preview da música');

            this.UICtrl.createPlayer(preview_url);
        })
    }
}

const APICtrl = new APIController();
const UICtrl = new UIController();
const APPCtrl = new APPController(UICtrl, APICtrl);
APPCtrl.start();

