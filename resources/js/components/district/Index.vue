<template>

    <!-- begin:: Content -->
    <div class="kt-container  kt-container--fluid  kt-grid__item kt-grid__item--fluid">
        <div class="row">
            <form>
                <div class="input-group mb-2 ml-2">
                    <input type="text" v-model="search" class="form-control" placeholder="Search for name...">
                </div>
            </form>
            <div class="col-lg-12">
                <div v-if="showMessage">
                    <div class="alert alert-success">{{ message }}</div>
                </div>
                <!--begin::Portlet-->
                <div class="kt-portlet kt-portlet--last kt-portlet--head-sm kt-portlet--responsive-mobile" id="kt_page_portlet">
                    <div class="kt-portlet__head kt-portlet__head--lg">
                        <div class="kt-portlet__head-label">
                            <span class="kt-portlet__head-icon">
                                <i class="fa fa-university"></i>
                            </span>
                            <h3 class="kt-portlet__head-title">
                                District List
                            </h3>
                        </div>
                        <div class="kt-portlet__head-toolbar">
                            <div class="btn-group">
                                <button type="button" class="btn btn-brand">
                                <router-link :to="{name: 'DistrictCreate'}" style="color:#fff;"><i class="la la-plus"></i> New District</router-link>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="kt-portlet__body">
                        <!--begin: Datatable -->
                        <table class="table table-striped- table-bordered table-hover table-checkable">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Country</th>
                                    <th>City</th>
                                    <th>Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="district in districts" :key="district.id">
                                    <td scope="row">{{ district.id }}</td>
                                    <td>{{ district.country.country }}</td>
                                    <td>{{ district.city.name }}</td>
                                    <td>{{ district.name }}</td>
                                    <td>
                                        <router-link :to="{name: 'DistrictEdit', params: { id: district.id}}" class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-edit"></i></router-link>
                                        <button @click="deleteDistrict(district.id)" class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-trash"></i></button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!--end: Datatable -->
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
                districts: [],
                showMessage: false,
                message: '',
                search: null,
            }
        },
        watch: {
            search() {
                this.getDistrict();
            }
        },
        created() {
            this.getDistrict();
        },
        methods: {
            getDistrict() {
                axios.get('/api/district', {
                        params: {search: this.search}
                    })
                    .then(res => {
                        this.districts = res.data.data
                    }).catch(error => {
                        console.log(error);
                    })
            },
            deleteDistrict(id) {
                axios.delete('/api/district/' + id)
                    .then(res => {
                        this.showMessage = true;
                        this.message = res.data;
                        this.getDistrict();
                    });
            }
        }
    }
</script>

<style>

</style>