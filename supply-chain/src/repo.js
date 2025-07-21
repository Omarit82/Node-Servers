const deals = await hub.crm.deals.searchApi.doSearch({
                filterGroups: [{
                    filters: [
                            {
                                propertyName: 'propuesta_comercial',
                                operator: 'HAS_PROPERTY'
                            },
                            {
                                propertyName:'despachado',
                                operator: 'NOT_HAS_PROPERTY'
                            },

                        ]
                    }
                ],
                properties: [
                    'dealname',
                    'pipeline',
                    'observaciones_para_produccion',
                    'numero_de_remito',
                    'datos_para_envio',
                    'cantidad_citymesh__autocalculada_',
                    'cantidad_de_equipos',
                    'description',
                    'despachado',
                    'nro_de_guia_del_envio',
                    'propuesta_comercial',
                    'hs_num_of_associated_line_items'
                ],
                limit: 50,
                after: 0,
                sorts: [
                    {
                        propertyName:'hs_object_id',
                        direction: 'DESCENDING'
                    }
                ]
            })
            const dealsId = []
            deals.results.forEach(element => {
                dealsId.push(element.id);
            });
            const engagementAssociated = await hub.crm.deals.basicApi.getById(dealsId[0],['dealname'],undefined,['tasks'],undefined,undefined,undefined);
            const dealsProp = await hub.crm.properties.coreApi.getAll('deals')
            const tasks = await hub.crm.objects.tasks.searchApi.doSearch({
                filterGroups: [{
                    filters: [
                            {
                                propertyName: 'hs_task_status',
                                operator: 'NEQ',
                                value: 'COMPLETED'
                            },
                            {
                                propertyName: 'hubspot_owner_id',
                                operator: 'EQ',
                                value: '50141006'
                            },
                            {
                                propertyName: 'hs_body_preview',
                                operator: 'HAS_PROPERTY'
                            }
                        ]
                    }
                ],
                properties: [
                    'hs_all_accessible_team_ids',
                    'hs_task_completion_count',
                    'hs_task_is_completed',
                    'hs_task_is_past_due_date',
                    'hs_task_priority',
                    'hs_timestamp',
                    'hubspot_owner_id',
                    'hs_engagement_source_id',
                    'hs_task_status',
                    'hs_task_subject',
                    'hs_body_preview',
                    'hs_deal_id'
                ],
                limit: 50,
                after: 0 ,
                sorts:[
                    {
                        propertyName:'hs_timestamp',
                        direction: 'ASCENDING'
                    }
                ]
            })