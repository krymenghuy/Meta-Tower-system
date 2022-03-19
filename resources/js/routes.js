import DistrictIndex from "./components/district/Index";
import DistrictCreate from "./components/district/Create";
import DistrictEdit from "./components/district/Edit";

export const routes = [
    {
        path: "/district",
        name: "DistrictIndex",
        component: DistrictIndex
    },
    {
        path: "/district/create",
        name: "DistrictCreate",
        component: DistrictCreate
    },
    {
        path: "/district/:id",
        name: "DistrictEdit",
        component: DistrictEdit
    }
];