<div id="_main_accountStaff_component" class="mobile-padding px-3" style="display:none;">
    <div class="d-flex justify-content-between w-100 rounded-2 shadow p-3 mt-2" style="background-color:#ffffff;" id="_divFilter_accountStaff">
        <div class="d-flex justify-content-start gap-3 w-50">
            <div class="d-flex justify-content-start w-50 position-relative">
                <input type="text" class="form-control rounded-2 filter-field pe-5" id="_search_accountStaff_info" placeholder="Search">
                <i class="fa fa-search fs-6 text-muted position-absolute" style="right: 15px; top: 50%; transform: translateY(-50%);"></i>
            </div>
             <div class="d-flex">
                    <select type="id" id="el_status" class="data-input filter-field" data-field="status_id"></select>
                </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-50">
            <button type="button" class="btnAddNewPrm d-flex align-items-center gap-2" id="_btnAddAccountStaff">
                <i class="fa fa-user-plus"></i>
                <span vslang="buttons.Create Account Staff"></span>
            </button>
        </div>
    </div>
    <div id="_staffAccount_info_list" class="mt-3"></div>
</div>





<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tenant Contract Portal - JS Version</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            box-sizing: border-box;
        }
        .contract-section {
            transition: all 0.3s ease;
        }
        .contract-section:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .status-active {
            background: linear-gradient(135deg, #10b981, #059669);
        }
        .status-pending {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }
        .status-expired {
            background: linear-gradient(135deg, #6b7280, #4b5563);
        }
        .progress-bar {
            background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        }
        .document-item {
            transition: all 0.2s ease;
        }
        .document-item:hover {
            background-color: #f8fafc;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-50 to-blue-50 min-h-full">
    <div id="app" class="min-h-full"></div>

    <script>
        // Application State
        const appState = {
            user: {
                name: "Sarah Johnson",
                email: "sarah.johnson@email.com",
                phone: "(555) 123-4567",
                initials: "SJ"
            },
            contract: {
                id: "LC-2024-001",
                type: "Residential Lease Agreement",
                property: "123 Oak Street, Apartment 4B, Springfield, IL 62701",
                status: "active",
                startDate: "Jan 1, 2024",
                endDate: "Dec 31, 2024",
                monthlyRent: 1250,
                securityDeposit: 1250,
                progress: {
                    completed: 10,
                    total: 12,
                    percentage: 83
                }
            },
            landlord: {
                name: "Springfield Properties LLC",
                email: "contact@springfieldproperties.com",
                phone: "(555) 987-6543"
            },
            terms: [
                {
                    title: "Rent Payment",
                    description: "Due on the 1st of each month"
                },
                {
                    title: "Pet Policy",
                    description: "One cat allowed with $200 deposit"
                },
                {
                    title: "Utilities",
                    description: "Tenant responsible for electricity & internet"
                },
                {
                    title: "Maintenance",
                    description: "24-hour notice required for entry"
                }
            ],
            documents: [
                {
                    name: "Lease Agreement",
                    type: "PDF",
                    size: "2.4 MB",
                    date: "Signed Jan 1, 2024",
                    icon: "document",
                    color: "red"
                },
                {
                    name: "Property Inspection",
                    type: "PDF",
                    size: "1.8 MB",
                    date: "Completed Dec 28, 2023",
                    icon: "clipboard",
                    color: "blue"
                },
                {
                    name: "Insurance Certificate",
                    type: "PDF",
                    size: "0.9 MB",
                    date: "Valid until Dec 31, 2024",
                    icon: "shield",
                    color: "green"
                },
                {
                    name: "Security Deposit Receipt",
                    type: "PDF",
                    size: "0.3 MB",
                    date: "Received Jan 1, 2024",
                    icon: "currency",
                    color: "purple"
                },
                {
                    name: "Keys & Access",
                    type: "PDF",
                    size: "0.5 MB",
                    date: "Updated Jan 1, 2024",
                    icon: "key",
                    color: "yellow"
                },
                {
                    name: "Property Rules",
                    type: "PDF",
                    size: "1.2 MB",
                    date: "Updated Jan 1, 2024",
                    icon: "info",
                    color: "indigo"
                }
            ],
            stats: {
                paidThisYear: 11250,
                totalInvoices: 12
            }
        };

        // Utility Functions
        const createElement = (tag, className = '', innerHTML = '') => {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (innerHTML) element.innerHTML = innerHTML;
            return element;
        };

        const formatCurrency = (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        };

        const showNotification = (message, type = 'success') => {
            const colors = {
                success: 'bg-green-500',
                info: 'bg-blue-500',
                warning: 'bg-orange-500',
                error: 'bg-red-500'
            };

            const notification = createElement('div', 
                `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50`,
                message
            );

            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        };

        // Icon Components
        const getIcon = (iconName) => {
            const icons = {
                document: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>`,
                clipboard: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>`,
                shield: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>`,
                currency: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>`,
                key: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>`,
                info: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
                user: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>`,
                building: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>`,
                download: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>`,
                chat: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>`,
                refresh: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
                lock: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v4a2 2 0 002 2h6a2 2 0 002-2v-4"></path>`,
                unlock: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>`
            };
            return icons[iconName] || icons.document;
        };

        // Component Builders
        const buildHeader = () => {
            return `
                <header class="bg-white shadow-sm border-b border-gray-200">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center h-16">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <span class="text-white font-bold text-sm">TC</span>
                                    </div>
                                </div>
                                <div class="ml-4">
                                    <h1 class="text-xl font-semibold text-gray-900">Contract Portal</h1>
                                </div>
                            </div>
                            <div class="flex items-center space-x-4">
                                <div class="text-sm text-gray-600">
                                    Welcome, <span class="font-medium text-gray-900">${appState.user.name}</span>
                                </div>
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span class="text-blue-600 font-medium text-sm">${appState.user.initials}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
            `;
        };

        const buildContractOverview = () => {
            const { contract } = appState;
            return `
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div class="flex-1">
                            <div class="flex items-center space-x-4 mb-4">
                                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        ${getIcon('clipboard')}
                                    </svg>
                                </div>
                                <div>
                                    <h2 class="text-xl font-bold text-gray-900">${contract.type}</h2>
                                    <p class="text-gray-600">${contract.property}</p>
                                </div>
                            </div>
                            
                            <div class="mb-4">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-sm font-medium text-gray-700">Lease Progress</span>
                                    <span class="text-sm text-gray-500">${contract.progress.completed} of ${contract.progress.total} months completed</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-2">
                                    <div class="progress-bar h-2 rounded-full" style="width: ${contract.progress.percentage}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex flex-col items-end space-y-2">
                            <span class="status-${contract.status} inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white">
                                ${contract.status.charAt(0).toUpperCase() + contract.status.slice(1)} Contract
                            </span>
                            <div class="text-right">
                                <p class="text-sm text-gray-500">Contract ID</p>
                                <p class="font-mono text-sm font-medium text-gray-900">${contract.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        };

        const buildKeyInformation = () => {
            const { contract } = appState;
            const keyInfo = [
                {
                    icon: 'lock',
                    color: 'green',
                    label: 'Start Date',
                    value: contract.startDate
                },
                {
                    icon: 'unlock',
                    color: 'red',
                    label: 'End Date',
                    value: contract.endDate
                },
                {
                    icon: 'currency',
                    color: 'blue',
                    label: 'Monthly Rent',
                    value: formatCurrency(contract.monthlyRent)
                },
                {
                    icon: 'shield',
                    color: 'purple',
                    label: 'Security Deposit',
                    value: formatCurrency(contract.securityDeposit)
                }
            ];

            return `
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    ${keyInfo.map(info => `
                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div class="flex items-center">
                                <div class="w-10 h-10 bg-${info.color}-100 rounded-lg flex items-center justify-center">
                                    <svg class="w-5 h-5 text-${info.color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        ${getIcon(info.icon)}
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm font-medium text-gray-600">${info.label}</p>
                                    <p class="text-lg font-bold text-gray-900">${info.value}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        };

        const buildContractSections = () => {
            return `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    ${buildTermsSection()}
                    ${buildPartiesSection()}
                </div>
            `;
        };

        const buildTermsSection = () => {
            return `
                <div class="contract-section bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-gray-900">Terms & Conditions</h3>
                        <button class="view-terms text-blue-600 hover:text-blue-700 text-sm font-medium">View Full Terms</button>
                    </div>
                    <div class="space-y-3">
                        ${appState.terms.map(term => `
                            <div class="flex items-start space-x-3">
                                <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                    <p class="text-sm font-medium text-gray-900">${term.title}</p>
                                    <p class="text-sm text-gray-600">${term.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        };

        const buildPartiesSection = () => {
            const { user, landlord } = appState;
            return `
                <div class="contract-section bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Parties Involved</h3>
                    <div class="space-y-4">
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center space-x-3 mb-2">
                                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        ${getIcon('user')}
                                    </svg>
                                </div>
                                <h4 class="font-medium text-gray-900">Tenant</h4>
                            </div>
                            <p class="text-sm text-gray-900 font-medium">${user.name}</p>
                            <p class="text-sm text-gray-600">${user.email}</p>
                            <p class="text-sm text-gray-600">${user.phone}</p>
                        </div>
                        
                        <div class="border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center space-x-3 mb-2">
                                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        ${getIcon('building')}
                                    </svg>
                                </div>
                                <h4 class="font-medium text-gray-900">Landlord</h4>
                            </div>
                            <p class="text-sm text-gray-900 font-medium">${landlord.name}</p>
                            <p class="text-sm text-gray-600">${landlord.email}</p>
                            <p class="text-sm text-gray-600">${landlord.phone}</p>
                        </div>
                    </div>
                </div>
            `;
        };

        const buildDocumentsSection = () => {
            return `
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold text-gray-900">Contract Documents</h3>
                        <button class="download-all bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                            Download All Documents
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="documents-grid">
                        ${appState.documents.map((doc, index) => `
                            <div class="document-item border border-gray-200 rounded-lg p-4 cursor-pointer" data-doc-index="${index}">
                                <div class="flex items-center space-x-3">
                                    <div class="w-10 h-10 bg-${doc.color}-100 rounded-lg flex items-center justify-center">
                                        <svg class="w-5 h-5 text-${doc.color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            ${getIcon(doc.icon)}
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <p class="font-medium text-gray-900">${doc.name}</p>
                                        <p class="text-sm text-gray-600">${doc.type} • ${doc.size}</p>
                                        <p class="text-xs text-gray-500">${doc.date}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        };

        const buildActionsSection = () => {
            return `
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Contract Actions</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button class="download-contract flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${getIcon('download')}
                            </svg>
                            <span>Download Contract</span>
                        </button>
                        
                        <button class="contact-landlord flex items-center justify-center space-x-2 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${getIcon('chat')}
                            </svg>
                            <span>Contact Landlord</span>
                        </button>
                        
                        <button class="request-renewal flex items-center justify-center space-x-2 border border-orange-300 hover:border-orange-400 text-orange-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${getIcon('refresh')}
                            </svg>
                            <span>Request Renewal</span>
                        </button>
                    </div>
                </div>
            `;
        };

        // Event Handlers
        const handleDocumentClick = (event) => {
            const docItem = event.target.closest('.document-item');
            if (docItem) {
                const docIndex = parseInt(docItem.dataset.docIndex);
                const document = appState.documents[docIndex];
                showNotification(`${document.name} opened successfully!`, 'info');
            }
        };

        const handleDownloadAll = () => {
            showNotification('All documents downloaded successfully!');
        };

        const handleDownloadContract = () => {
            showNotification('Contract downloaded successfully!');
        };

        const handleContactLandlord = () => {
            showNotification('Opening contact form...', 'info');
        };

        const handleRequestRenewal = (button) => {
            const originalContent = button.innerHTML;
            
            button.innerHTML = `
                <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Processing...</span>
            `;
            
            setTimeout(() => {
                button.innerHTML = `
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Request Sent</span>
                `;
                button.className = 'flex items-center justify-center space-x-2 border border-green-300 bg-green-50 text-green-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200';
                
                showNotification('Renewal request sent to landlord!');
                
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.className = 'request-renewal flex items-center justify-center space-x-2 border border-orange-300 hover:border-orange-400 text-orange-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200';
                }, 5000);
            }, 2000);
        };

        const handleViewTerms = () => {
            showNotification('Opening full terms document...', 'info');
        };

        // Main App Initialization
        const initializeApp = () => {
            const app = document.getElementById('app');
            
            app.innerHTML = `
                ${buildHeader()}
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    ${buildContractOverview()}
                    ${buildKeyInformation()}
                    ${buildContractSections()}
                    ${buildDocumentsSection()}
                    ${buildActionsSection()}
                </main>
            `;

            // Attach event listeners
            attachEventListeners();
        };

        const attachEventListeners = () => {
            // Document clicks
            document.addEventListener('click', (event) => {
                if (event.target.closest('.document-item')) {
                    handleDocumentClick(event);
                }
                
                if (event.target.closest('.download-all')) {
                    event.preventDefault();
                    handleDownloadAll();
                }
                
                if (event.target.closest('.download-contract')) {
                    event.preventDefault();
                    handleDownloadContract();
                }
                
                if (event.target.closest('.contact-landlord')) {
                    event.preventDefault();
                    handleContactLandlord();
                }
                
                if (event.target.closest('.request-renewal')) {
                    event.preventDefault();
                    handleRequestRenewal(event.target.closest('.request-renewal'));
                }
                
                if (event.target.closest('.view-terms')) {
                    event.preventDefault();
                    handleViewTerms();
                }
            });
        };

        // API Simulation Functions
        const updateContractProgress = (completed, total) => {
            appState.contract.progress.completed = completed;
            appState.contract.progress.total = total;
            appState.contract.progress.percentage = Math.round((completed / total) * 100);
            
            // Re-render contract overview
            const overview = document.querySelector('.bg-white.rounded-xl.shadow-sm.border.border-gray-200.p-6.mb-8');
            if (overview) {
                overview.outerHTML = buildContractOverview();
            }
        };

        const addDocument = (document) => {
            appState.documents.push(document);
            
            // Re-render documents section
            const documentsGrid = document.getElementById('documents-grid');
            if (documentsGrid) {
                documentsGrid.innerHTML = appState.documents.map((doc, index) => `
                    <div class="document-item border border-gray-200 rounded-lg p-4 cursor-pointer" data-doc-index="${index}">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-${doc.color}-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-${doc.color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    ${getIcon(doc.icon)}
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-gray-900">${doc.name}</p>
                                <p class="text-sm text-gray-600">${doc.type} • ${doc.size}</p>
                                <p class="text-xs text-gray-500">${doc.date}</p>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        };

        const updateContractStatus = (status) => {
            appState.contract.status = status;
            
            // Re-render contract overview
            const overview = document.querySelector('.bg-white.rounded-xl.shadow-sm.border.border-gray-200.p-6.mb-8');
            if (overview) {
                overview.outerHTML = buildContractOverview();
            }
        };

        // Initialize the application
        document.addEventListener('DOMContentLoaded', initializeApp);

        // Expose functions for external use (if needed)
        window.ContractPortal = {
            updateProgress: updateContractProgress,
            addDocument: addDocument,
            updateStatus: updateContractStatus,
            getState: () => appState
        };
    </script>
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'993f1a59f558fd02',t:'MTc2MTM2NzkzMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
</html>
