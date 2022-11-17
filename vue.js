const { createApp } = Vue

const app = createApp( {
    data(){
        return {
            eventos : [],
            currentDate : [],
            categoriasFiltradas: [],
            categoriasFiltradasComing: [],
            eventosComing : [],
            categoriasFiltradasPast: [],
            eventosPast : [],
            eventosFiltrados : [],
            eventosFiltradosComing: [],
            eventosFiltradosPast: [],
            eventoDetails : '',
            checked : [],
            inputBusqueda : '',
            eventosNuevoObj: [],
            categoriaNuevoObjComing: [],
            categoriaNuevoObjPast: [],
            eventoMayorPorcentaje: '',
            eventoMenorPorcentaje: '',
            eventoMayorCapacidad: '',
        }
    },
    created(){
            fetch('https://amazing-events.herokuapp.com/api/events')
            .then( response => response.json())
            .then( data => {
                this.eventos = data.events
                this.currentDate = data.currentDate
                this.eventosComing = data.events.filter( element => element.date > this.currentDate)
                this.eventosPast = data.events.filter( element => element.date < this.currentDate)
                this.eventosFiltrados = data.events
                this.eventosFiltradosComing = this.eventosComing
                this.eventosFiltradosPast = this.eventosPast
                this.filtrarCategoria()
                this.filtrarCategoriaComing()
                this.filtrarCategoriaPast()
                this.eventoDetailsFil()
                this.crearObjetoNuevo(this.eventos)
                this.datosPrimeraTabla()
                this.crearCategoriaNueva(this.categoriasFiltradasComing, this.categoriaNuevoObjComing, this.eventosNuevoObj)
                this.crearCategoriaNuevaPast(this.categoriasFiltradasPast, this.categoriaNuevoObjPast, this.eventosNuevoObj)
                
                
            })
            .catch( err => console.log(err))
            this.eventoDetails = JSON.parse(localStorage.getItem('Event'))
             if(!this.eventoDetails){
            this.eventoDetails = []
            }
    },
    methods: {
        filtrarCategoria(){
            let fn = events => events.category
            this.categoriasFiltradas = [... new Set( this.eventos.filter( fn ).map( fn ) ) ]
        },
        buscar(){
          this.eventosFiltrados = this.eventos.filter( evento => evento.name.toLowerCase().trim().includes( this.inputBusqueda.toLowerCase().trim() ) )
        },
        filtrarCategoriaComing(){
            let fn = events => events.category
            this.categoriasFiltradasComing = [... new Set( this.eventosComing.filter( fn ).map( fn ) ) ]
        },
        filtrarCategoriaPast(){
            let fn = events => events.category
            this.categoriasFiltradasPast = [... new Set( this.eventosPast.filter( fn ).map( fn ) ) ]
        },
        eventoDetailsFil(){
            let queryString = location.search;
            let params = new URLSearchParams(queryString);
            let id = params.get("id");
            this.eventoDetails = this.eventos.find((evento) => evento._id == id);
        },
        crearObjetoNuevo(array){
            this.eventosNuevoObj = array.map( elemento => {
                if (elemento.estimate){
                return {
                    name: elemento.name,
                    category: elemento.category,
                    estimate: elemento.estimate,
                    capacity: elemento.capacity,
                    price: elemento.price,
                    percentage: Math.round(elemento.estimate*100/elemento.capacity),
                    revenues: elemento.price*elemento.estimate,
                    date: elemento.date

                }}else{
                return{
                    name: elemento.name,
                    category: elemento.category,
                    assistance: elemento.assistance,
                    capacity: elemento.capacity,
                    price: elemento.price,
                    percentage: Math.round(elemento.assistance*100/elemento.capacity),
                    revenues: elemento.price*elemento.assistance,
                    date: elemento.date
                }
                }
            })
        },
        datosPrimeraTabla(){
            this.eventoMayorPorcentaje = this.eventosNuevoObj.filter(e => e.date < this.currentDate).filter(e => e.percentage).sort( (a,b) => b.percentage - a.percentage ).map(e => e.name).slice(0,1)
            this.eventoMenorPorcentaje = this.eventosNuevoObj.filter(e => e.date < this.currentDate).filter(e => e.percentage).sort( (a,b) => b.percentage - a.percentage ).map(e => e.name).slice(-1)
            this.eventoMayorCapacidad = this.eventosNuevoObj.filter(e => e.capacity).sort( (a,b) => b.capacity - a.capacity ).map(e => e.name).slice(0,1)
        },
        crearCategoriaNueva(desde, donde, array){
            desde.map( evento => donde.push({
                nombre: evento,
                revenues: array.filter(e => e.category == evento && e.date > this.currentDate ).map(e => e.revenues).reduce((actual,total) => actual+=total), 
                estimate: array.filter(e => e.category == evento && e.date > this.currentDate ).map(e => parseInt(e.estimate)).reduce((actual,total) => actual+=total),
                capacity : array.filter(e => e.category == evento && e.date > this.currentDate ).map(e => parseInt(e.capacity)).reduce((actual,total) => actual+=total)  
            }))
        },
        crearCategoriaNuevaPast(desde, donde, array){
            desde.map( evento => donde.push({
                nombre: evento,
                revenues: array.filter(e => e.category == evento && e.date < this.currentDate ).map(e => e.revenues).reduce((actual,total) => actual+=total), 
                assistance: array.filter(e => e.category == evento && e.date < this.currentDate ).map(e => parseInt(e.assistance)).reduce((actual,total) => actual+=total),
                capacity : array.filter(e => e.category == evento && e.date < this.currentDate ).map(e => parseInt(e.capacity)).reduce((actual,total) => actual+=total)  
            }))
        }

        
    },
    computed:{
        filtrar(){
            const filtroPorChecked = this.eventos.filter( evento => this.checked.includes( evento.category ) || this.checked.length === 0)
            this.eventosFiltrados = filtroPorChecked.filter( evento => evento.name.toLowerCase().trim().includes( this.inputBusqueda.toLowerCase().trim() ) )
        },
        filtrarComing(){
            const filtroPorCheckedComing = this.eventosComing.filter( evento => this.checked.includes( evento.category ) || this.checked.length === 0)
            this.eventosFiltradosComing = filtroPorCheckedComing.filter( evento => evento.name.toLowerCase().trim().includes( this.inputBusqueda.toLowerCase().trim() ) )
        },
        filtrarPast(){
            const filtroPorCheckedPast = this.eventosPast.filter( evento => this.checked.includes( evento.category ) || this.checked.length === 0)
            this.eventosFiltradosPast = filtroPorCheckedPast.filter( evento => evento.name.toLowerCase().trim().includes( this.inputBusqueda.toLowerCase().trim() ) )
        }
        
    }

} )

app.mount('#app')