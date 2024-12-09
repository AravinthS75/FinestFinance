import SwalDefault, * as Swal from 'sweetalert2';
import * as i0 from "@angular/core";
export type SwalModule = typeof SwalDefault | typeof Swal;
export type SwalProvider = SwalModuleLoader | SwalModule;
export type SwalModuleLoader = () => Promise<SwalModule>;
export declare class SweetAlert2LoaderService {
    private readonly swalProvider;
    private swalPromiseCache?;
    constructor(swalProvider: any);
    get swal(): Promise<typeof SwalDefault>;
    preloadSweetAlertLibrary(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SweetAlert2LoaderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SweetAlert2LoaderService>;
}
