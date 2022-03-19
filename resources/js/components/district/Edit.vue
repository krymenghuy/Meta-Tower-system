<template>

    <!-- begin:: Content -->
    <div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <div class="row">
            <div class="col-lg-12">

                <!--begin::Portlet-->
                <div class="kt-portlet kt-portlet--last kt-portlet--head-sm kt-portlet--responsive-mobile" id="kt_page_portlet">
                    <div class="kt-portlet__head kt-portlet__head--sm">
                        <div class="kt-portlet__head-label">
                            <span class="kt-portlet__head-icon">
                                <i class="la la-plus"></i>
                            </span>
                            <h3 class="kt-portlet__head-title">
                                Edit District
                            </h3>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        <form @submit.prevent="updateDistrict">
                            <div class="kt-portlet__body">
                                <div class="row">
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>Country</label>
                                            <select class="form-control" v-model="form.country_id" @change="getCities()">
                                                <option value="">Pick a country</option>
                                                <option v-for="country in countries" :key="country.id" :value="country.id">{{ country.country }}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-sm-6">
                                        <div class="form-group">
                                            <label>City</label>
                                            <select class="form-control" v-model="form.city_id">
                                                <option value="">Pick a city...</option>
                                                <option v-for="city in cities" :key="city.id" :value="city.id">{{ city.name}}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-12 col-sm-12">
                                        <div class="form-group">
                                            <label>District</label>
                                            <input type="text" v-model="form.name" class="form-control" required>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                            <div class="kt-portlet__foot">
                                <div class="kt-form__actions">
                                    <button type="submit" class="btn btn-brand mb-2"><i class="fa fa-plus"></i> Edit District</button>
                                    <router-link :to="{name: 'DistrictIndex'}" class="btn btn-warning btn-elevate btn-icon-sm mb-2"><i class="fa fa-backward"></i>Go Back</router-link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <!--end::Portlet-->
            </div>
        </div>
    </div>
    <!-- end:: Content -->

</template>

<script>
export default {
    data() {
        return {
            countries: [],
            cities: [],
            form: {
                country_id: '',
                city_id: '',
                name: '',
            }
        }
    },
    created() {
        this.getCountries();
        this.getDistrict();
    },
    methods: {
        getDistrict(){
             axios.get('/api/district/' + this.$route.params.id)
                .then(res => {
                    this.form = res.data.data;
                    this.getCities();
                }).catch(error => {
                    console.log(console.error)
                })
        },
        getCountries(){
            axios.get('/api/district/countries')
                .then(res => {
                    this.countries = res.data
                }).catch(error => {
                    console.log(console.error)
                })
        },
        getCities(){
            axios.get('/api/district/'+ this.form.country_id + '/cities')
                .then(res => {
                    this.cities = res.data
                }).catch(error => {
                    console.log(console.error)
                })
        },
        updateDistrict(){
           axios.put('/api/district/' + this.$route.params.id, {
                'country_id': this.form.country_id,
                'city_id': this.form.city_id,
                'name': this.form.name
            }).then(res => {
                this.$router.push({name: 'DistrictIndex'});
            })
        }
    }
}
</script>

<style>

</style>