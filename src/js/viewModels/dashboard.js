
define(['ojs/ojcore',
    'knockout',
    'jquery',
    'ojs/ojarraydataprovider',
    'ojs/ojknockout',
    'ojs/ojtable',
    'ojs/ojinputtext',
    'ojs/ojbutton',
    'ojs/ojarraytabledatasource'],
(oj, ko, $, ArrayDataProvider) => {
    function DashboardViewModel() {
        const self = this;

        self.filter = ko.observable();

        const baseDeptArray = [
            { ID_PRU: '1', FECHA_INICIO: '15/05/08', FECHA_FIN: '30/07/08' },
            { ID_PRU: '2', FECHA_INICIO: '01/11/08', FECHA_FIN: '06/03/09' },
            { ID_PRU: '3', FECHA_INICIO: '01/05/09', FECHA_FIN: '21/07/09' },
            { ID_PRU: '4', FECHA_INICIO: '01/11/09', FECHA_FIN: '30/11/09' },
            { ID_PRU: '5', FECHA_INICIO: '01/05/10', FECHA_FIN: '31/05/10' },
            { ID_PRU: '6', FECHA_INICIO: '01/11/10', FECHA_FIN: '30/11/10' },
            { ID_PRU: '7', FECHA_INICIO: '01/05/11', FECHA_FIN: '16/06/11' },
            { ID_PRU: '8', FECHA_INICIO: '01/11/11', FECHA_FIN: '30/11/11' },
            { ID_PRU: '9', FECHA_INICIO: '01/05/12', FECHA_FIN: '31/05/12' },
            { ID_PRU: '10', FECHA_INICIO: '16/11/12', FECHA_FIN: '30/11/12' }
        ];

        const baseDeptArray2 = [
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 10
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 20
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 30
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 40
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 50
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 60
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 70
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 80
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 90
            },
            {
                Username: 'PERSONA', Nombre: 'Juan Perez', CURP: 'CURPPER', RFC: 'RFCPER', Cve_Banco: 100
            }
        ];

        function generateDeptArray(num) {
            const deptArray = [];
            let i; let j; let
                count = 0;

            for (i = 0; i < num; i++) {
                for (j = 0; j < baseDeptArray.length; j++) {
                    deptArray[count] = $.extend({}, baseDeptArray[j]);
                    deptArray[count].ID_PRU = deptArray[count].ID_PRU;
                    count++;
                }
            }
            return deptArray;
        }

        function generateDeptArray2(num, id_pru) {
            const deptArray2 = [];
            const baseDeptArray2Copy = JSON.parse(JSON.stringify(baseDeptArray2));

            let i; let j; let
                count = 0;

            // iterate over a number of times
            for (i = 0; i < num; i++) {
                // all the items in the base 2 array
                for (j = 0; j < baseDeptArray2Copy.length; j++) {
                    const obj = baseDeptArray2Copy[j];

                    obj.Username = `${obj.Username + count.toString()}-${id_pru.toString()}`;
                    obj.Nombre = `${obj.Nombre + count.toString()}-${id_pru.toString()}`;
                    count++;

                    deptArray2.push(obj);
                }
            }

            return deptArray2;
        }

        self.deptArray = generateDeptArray(1);
        self.dataprovider = ko.observable(new ArrayDataProvider(self.deptArray, { keyAttributes: 'ID_PRU' }));

        self.deptArray2 = [];
        self.dataprovider2 = ko.observable(new ArrayDataProvider(self.deptArray2, { keyAttributes: 'Username' }));

        self.highlightChars = [];

        self.handleValueChanged = function () {
            self.highlightChars = [];
            const filter = document.getElementById('filter').rawValue;
            if (filter.length == 0) {
                self.clearClick();
                return;
            }

            const deptArray = [];
            let i;
            let id;

            function getHighlightCharIndexes(highlightChars, text) {
                const highlightCharStartIndex = text.toString().toLowerCase().indexOf(highlightChars.toString().toLowerCase());
                return { startIndex: highlightCharStartIndex, length: highlightChars.length };
            }

            for (i = self.deptArray.length - 1; i >= 0; i--) {
                id = self.deptArray[i].DepartmentId;

                Object.keys(self.deptArray[i]).forEach((field) => {
                    if (self.deptArray[i][field].toString().toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                        self.highlightChars[id] = self.highlightChars[id] || {};
                        self.highlightChars[id][field] = getHighlightCharIndexes(filter, self.deptArray[i][field]);

                        if (deptArray.indexOf(self.deptArray[i]) < 0) {
                            deptArray.push(self.deptArray[i]);
                        }
                    }
                });
            }

            deptArray.reverse();

            self.dataprovider(new ArrayDataProvider(deptArray, { keyAttributes: 'ID_PRU' }));
        };

        self.clearClick = function (event) {
            self.filter('');
            self.dataprovider(new ArrayDataProvider(self.deptArray, { keyAttributes: 'ID_PRU' }));
            self.highlightChars = [];
            document.getElementById('filter').value = '';
            return true;
        };

        self.highlightingCellRenderer = function (context) {
            // var id = context.row.DepartmentId;
            const id = context.row.ID_PRU;
            let startIndex = null;
            let length = null;
            let field = null;

            if (context.columnIndex === 0) {
                field = 'ID_PRU';
            } else if (context.columnIndex === 1) {
                field = 'FECHA_INICIO';
            } else if (context.columnIndex === 2) {
                field = 'FECHA_FIN';
            }


            let data = context.row[field].toString();

            if (self.highlightChars[id] != null && self.highlightChars[id][field] != null) {
                startIndex = self.highlightChars[id][field].startIndex;
                length = self.highlightChars[id][field].length;
            }

            if (startIndex != null && length != null) {
                const highlightedSegment = data.substr(startIndex, length);
                data = `${data.substr(0, startIndex)}<b>${highlightedSegment}</b>${data.substr(startIndex + length, data.length - 1)}`;
            }

            $(context.cellContext.parentElement).append(data);
        };

        self.columnArray = [{
            headerText: 'Id Periodo',
            renderer: self.highlightingCellRenderer
        },
        {
            headerText: 'Fecha inicial',
            renderer: self.highlightingCellRenderer
        },
        {
            headerText: 'Fecha Final',
            renderer: self.highlightingCellRenderer
        }];


        self.filter2 = ko.observable();


        self.highlightChars2 = [];
        self.handleValueChanged2 = function () {
            self.highlightChars2 = [];
            const filter2 = document.getElementById('filter2').rawValue;

            if (filter2.length == 0) {
                self.clearClick2();
                return;
            }

            const deptArray2 = [];
            let i; let
                id;

            for (i = self.deptArray2.length - 1; i >= 0; i--) {
                id = self.deptArray2[i].DepartmentId;
                Object.keys(self.deptArray2[i]).forEach((field) => {
                    if (self.deptArray2[i][field].toString().toLowerCase().indexOf(filter2.toLowerCase()) >= 0) {
                        self.highlightChars2[id] = self.highlightChars2[id] || {};
                        self.highlightChars2[id][field] = getHighlightCharIndexes2(filter2, self.deptArray2[i][field]);

                        if (deptArray2.indexOf(self.deptArray2[i]) < 0) {
                            deptArray2.push(self.deptArray2[i]);
                        }
                    }
                });
            }

            deptArray2.reverse();

            self.dataprovider2(new oj.ArrayTableDataSource(deptArray2, { keyAttributes: 'Username' }));


            function getHighlightCharIndexes2(highlightChars2, text) {
                const highlightCharStartIndex = text.toString().toLowerCase().indexOf(highlightChars2.toString().toLowerCase());
                return { startIndex: highlightCharStartIndex, length: highlightChars2.length };
            }
        };

        self.clearClick2 = function (event) {
            self.filter2('');

            self.dataprovider2(new oj.ArrayTableDataSource(self.deptArray2, { keyAttributes: 'Username' }));

            self.highlightChars2 = [];

            document.getElementById('filter2').value = '';

            return true;
        };

        self.highlightingCellRenderer2 = function (context) {
            const id = context.row.DepartmentId;

            let startIndex = null;

            let length = null;

            let field = null;

            if (context.columnIndex === 0) {
                field = 'Username';
            } else if (context.columnIndex === 1) {
                field = 'Nombre';
            } else if (context.columnIndex === 2) {
                field = 'CURP';
            } else if (context.columnIndex === 3) {
                field = 'RFC';
            } else if (context.columnIndex === 4) {
                field = 'Cve_Banco';
            }

            let data = context.row[field].toString();

            if (self.highlightChars2[id] != null

          && self.highlightChars2[id][field] != null) {
                startIndex = self.highlightChars2[id][field].startIndex;

                length = self.highlightChars2[id][field].length;
            }

            if (startIndex != null

          && length != null) {
                const highlightedSegment = data.substr(startIndex, length);

                data = `${data.substr(0, startIndex)}<b>${highlightedSegment}</b>${data.substr(startIndex + length, data.length - 1)}`;
            }

            $(context.cellContext.parentElement).append(data);
        };

        self.columnArray2 = [{
            headerText: 'Clave Usuario',

            renderer: self.highlightingCellRenderer2
        },

        {
            headerText: 'Nombre',

            renderer: self.highlightingCellRenderer2
        },

        {
            headerText: 'CURP',

            renderer: self.highlightingCellRenderer2
        },

        {
            headerText: 'RFC',

            renderer: self.highlightingCellRenderer2
        },

        {
            headerText: 'Clave Intermediario',

            renderer: self.highlightingCellRenderer2
        }];


        self.currentRowListener = function (event) {
            const data = event.detail;

            if (event.type == 'currentRowChanged' && data.value != null) {
                const { rowIndex } = data.value;

                self.deptArray2 = generateDeptArray2(1, rowIndex);


                self.dataprovider2(new oj.ArrayTableDataSource(self.deptArray2, { keyAttributes: 'Username' }));
            }
        };


        self.transitionCompleted = function () {
            const table = document.getElementById('table');

            table.addEventListener('currentRowChanged', self.currentRowListener);
        };
    }

    return new DashboardViewModel();
});
