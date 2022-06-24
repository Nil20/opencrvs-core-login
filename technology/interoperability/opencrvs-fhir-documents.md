# OpenCRVS FHIR Documents

### Requesting the FHIR Composition for a birth event

The payload of the birth registration event webhook contains the [FHIR Composition](https://www.hl7.org/fhir/composition.html) id, that can be used to retrieve all subsequent details for the registration. So, subscribing to this webhook is good place to start to begin any integration.&#x20;

The FHIR Composition id is a powerful identifier and should only be accessible by approved government systems, such as those using `health` or `nationalId` JWT scopes. If you are proposing a new webhook in a feature request, consider the `resourceType` that your service requires, based on the explanation of the FHIR resources in the rest of this page. You should not need to expose the composition id in your mediator if your client service doesnt require it.

The FHIR Composition id is a powerful identifier and should only be accessible by approved government systems, such as those using `health` or `nationalId` JWT scopes. If you are proposing a new webhook in a feature request, consider the `resourceType` that your service requires, based on the explanation of the FHIR resources in the rest of this page. You should not need to expose the composition id in your mediator if your client service doesnt require it.

| Parameter             | Sample value                           | Description                                                                                                                                                                                               |
| --------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `target.id`           | `bab755e0-7bbd-4d90-b155-352ffa283467` | The unique `id` for the [FHIR resource](https://www.hl7.org/fhir/resource.html) target that this webhook refers to.                                                                                       |
| `target.resourceType` | `Composition`                          | The [FHIR resource](https://www.hl7.org/fhir/resource.html) type associated with the target `id` of this webhook, e.g. `Composition` for a [FHIR Composition](https://www.hl7.org/fhir/composition.html). |

**URL**

You can request the composition payload via the OpenHIM core using an [authentication token](https://github.com/opencrvs/opencrvs.github.io/blob/master/website/docs/technology/technicalInteroperability) and Composition `id`.

```
GET http://openhim-core:5001/fhir/Composition/<target.id>
```

NOTE: If the webhook returned a different resourceType, you could do this:

```
GET http://openhim-core:5001/fhir/<target.resourceType>/<target.id>
```

**Request headers**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Composition payload**

```
{
  "identifier": { "system": "urn:ietf:rfc:3986", "value": "BKBQMCD" },
  "resourceType": "Composition",
  "status": "preliminary",
  "type": {
    "coding": [
      { "system": "http://opencrvs.org/doc-types", "code": "birth-application" }
    ],
    "text": "Birth Application"
  },
  "class": {
    "coding": [
      { "system": "http://opencrvs.org/doc-classes", "code": "crvs-document" }
    ],
    "text": "CRVS Document"
  },
  "title": "Birth Application",
  "section": [
    {
      "title": "Birth encounter",
      "code": {
        "coding": [
          {
            "system": "http://opencrvs.org/specs/sections",
            "code": "birth-encounter"
          }
        ],
        "text": "Birth encounter"
      },
      "entry": [
        { "reference": "Encounter/af7be33b-3e0c-4012-b894-c32d4bcc5100" }
      ]
    },
    {
      "title": "Child details",
      "code": {
        "coding": [
          {
            "system": "http://opencrvs.org/doc-sections",
            "code": "child-details"
          }
        ],
        "text": "Child details"
      },
      "entry": [{ "reference": "Patient/0a92c057-e1a6-476f-918b-7e98cb7479b8" }]
    },
    {
      "title": "Mother's details",
      "code": {
        "coding": [
          {
            "system": "http://opencrvs.org/doc-sections",
            "code": "mother-details"
          }
        ],
        "text": "Mother's details"
      },
      "entry": [{ "reference": "Patient/5e22eea3-2e61-4dc1-8047-e216b3334c2e" }]
    },
    {
      "title": "Father's details",
      "code": {
        "coding": [
          {
            "system": "http://opencrvs.org/doc-sections",
            "code": "father-details"
          }
        ],
        "text": "Father's details"
      },
      "entry": [{ "reference": "Patient/5e22eea3-2e61-4dc1-8047-e216b3334c2e" }]
    },
     {
        "title": "Informant's details",
        "code": {
            "coding": {
            "system": "http://opencrvs.org/specs/sections",
            "code": "informant-details"
            },
            "text": "Informant's details"
        },
        "text": "",
        "entry": [
            {
            "reference": "Patient/47a090fa-e7bf-457f-98a6-8f2eb60fef32"
            }
        ]
    },
    {
        "title": "Supporting documents",
        "code": {
            "coding": {
            "system": "http://opencrvs.org/specs/sections",
            "code": "supporting-documents"
            },
            "text": "Supporting documents"
        },
        "text": "",
        "entry": [
            {
            "reference": "DocumentReference/11d2b8fc-f875-49cc-96e6-2447ebfc8fc6"
            }
        ]
    },
    {
        "title": "Certificates",
        "code": {
            "coding": {
            "system": "http://opencrvs.org/specs/sections",
            "code": "certificates"
            },
            "text": "Certificates"
        },
        "text": "",
        "entry": [
            {
            "reference": "DocumentReference/301ef878-1f94-4979-b660-7ad926dd1941"
            }
        ]
    }

  ],
  "subject": {},
  "date": "2020-07-02T15:28:34.813Z",
  "author": [],
  "meta": {
    "lastUpdated": "2020-07-02T15:28:35.392+00:00",
    "versionId": "de12d2df-fac3-4f84-bc85-b665ba12b02f"
  },
  "id": "bab755e0-7bbd-4d90-b155-352ffa283467"
}
```

**Key payload parameters**

| Parameter          | Sample value                           | Description                                                                                                                                                                                                                                             |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`               | `bab755e0-7bbd-4d90-b155-352ffa283467` | The unique `id` for the [FHIR Composition](https://www.hl7.org/fhir/composition.html).                                                                                                                                                                  |
| `identifier.value` | `BKBQMCD`                              | The customer facing OpenCRVS `tracking id` for the event application.                                                                                                                                                                                   |
| `resourceType`     | `Composition`                          | The [FHIR resource](https://www.hl7.org/fhir/resource.html) type associated.                                                                                                                                                                            |
| `section`          | `[{ ... code.coding[0].code }]`        | An array of [FHIR Composition sections](https://www.hl7.org/fhir/composition-definitions.html#Composition.section) that can be filtered by code to find the appropriate resource entry [reference](https://www.hl7.org/fhir/references.html#Reference). |

The relevant birth registration composition section codes are:

| Section                | Code                   | Entry [reference](https://www.hl7.org/fhir/references.html#Reference)                                                                                                                                   |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Encounter`            | `birth-encounter`      | The [FHIR encounter](https://www.hl7.org/fhir/encounter.html) is a resource encompassing the lifecycle of the event registration process                                                                |
| `Child`                | `child-details`        | The [FHIR patient](https://www.hl7.org/fhir/patient.html) resource for the child                                                                                                                        |
| `Mother`               | `mother-details`       | The [FHIR patient](https://www.hl7.org/fhir/patient.html) resource for the mother                                                                                                                       |
| `Father`               | `father-details`       | The [FHIR patient](https://www.hl7.org/fhir/patient.html) resource for the father                                                                                                                       |
| `Informant`            | `informant-details`    | The [FHIR patient](https://www.hl7.org/fhir/patient.html) resource for the informant - in case the child was registered by someone other than a parent such as a legal guardian, or a self-registration |
| `Supporting documents` | `supporting-documents` | An array of [FHIR DocumentReference](https://www.hl7.org/fhir/documentreference.html) resources for all the uploaded supporting documents to validate the registration                                  |
| `Certificates`         | `certificates`         | An array of [FHIR DocumentReference](https://www.hl7.org/fhir/documentreference.html) resources for all birth certificates generated and printed                                                        |

### Requesting the FHIR Patient data for individiuals associated with the event

The [FHIR patient](https://www.hl7.org/fhir/patient.html) resource contains all names, addresses, contact details, gender details and other information. It also contains an array of identifiers for which the created National ID, alongside other IDs such as Social Security or Birth Registration Number can be stored.

For standardised addresses ie: states, districts and other administrative structure levels, configurable [FHIR Location](https://www.hl7.org/fhir/location.html) resources can be loaded into OpenCRVS and referred to by their resource `id` in the address. You can read more about [FHIR Locations](https://www.hl7.org/fhir/location.html) in later sections below.

**YOUR MEDIATOR MUST FOLLOW THE SECURITY GUIDANCE ABOVE, BEFORE PERMITTING ACCESS TO SENSITIVE, IDENTIFIABLE PATIENT DATA**

**URL**

You can request all resources via OpenHIM in subsequent individual requests following this example URL for a Patient, to retrieve the details of the mother. So the format is **your-openhim-core-url** / **resourceType** / **id** :

```
GET http://openhim-core:5001/fhir/Patient/0a92c057-e1a6-476f-918b-7e98cb7479b8
```

Created from the previous composition like this:

```
GET http://openhim-core:5001/fhir/<section[0].entry[0].reference>
```

**Request headers**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Patient payload**

```
{
  "resourceType": "Patient",
  "active": true,
  "id": "5e22eea3-2e61-4dc1-8047-e216b3334c2e",
  "identifier": [
    { "value": "123456789", "type": "NATIONAL_ID" },
    { "value": "123456789", "type": "SOCIAL_SECURITY_NO" }
  ],
  "name": [{ "use": "en", "given": ["Fahmida"], "family": ["Hossein"] }],
  "birthDate": "1971-10-23",
  "maritalStatus": {
    "coding": [
      {
        "system": "http://hl7.org/fhir/StructureDefinition/marital-status",
        "code": "M"
      }
    ],
    "text": "MARRIED"
  },
  "extension": [
    {
      "url": "http://opencrvs.org/specs/extension/patient-occupation",
      "valueString": "Lawyer"
    },
    {
      "url": "http://hl7.org/fhir/StructureDefinition/patient-nationality",
      "extension": [
        {
          "url": "code",
          "valueCodeableConcept": {
            "coding": [{ "system": "urn:iso:std:iso:3166", "code": "ZMB" }]
          }
        },
        { "url": "period", "valuePeriod": { "start": "", "end": "" } }
      ]
    },
    {
      "url": "http://opencrvs.org/specs/extension/educational-attainment",
      "valueString": "PRIMARY_ISCED_1"
    }
  ],
  "address": [
    {
      "type": "PERMANENT",
      "line": [
        "40",
        "My street",
        "My residential area",
        "My city",
        "",
        "",
        "URBAN"
      ],
      "district": "6885f574-eb70-46dd-ab89-acc9982bd63e",
      "state": "cd5e34cb-abe0-4900-9509-28f378b8d8e8",
      "country": "ZMB"
    }
  ],
  "meta": {
    "lastUpdated": "2020-07-04T10:15:03.286+00:00",
    "versionId": "cf6bb775-f37e-43c5-ae16-a981a0c637d1"
  }
}
```

**Key payload parameters**

| Parameter       | Sample value                                                                                                                                             | Description                                                                                                                                                                                                                                                                                                           |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identifier`    | `[{ value: "123456789", type: "NATIONAL_ID" }]`                                                                                                          | An aray of identifiers for the patient.                                                                                                                                                                                                                                                                               |
| `name`          | `[{ "use": "en", "given": ["Fahmida"], "family": ["Hossein"] }]`                                                                                         | The `name` prop is extremely flexible for any language and name structure.                                                                                                                                                                                                                                            |
| `extension`     | `[{ "url": "http://hl7.org ... ", "extension": ["url": "code", "valueCodeableConcept": {}], "valueString": "" }]`                                        | Extensions are common in FHIR and refer to standardised codes, such as ICD codes, OpenCRVS concepts, or can be custom values.                                                                                                                                                                                         |
| `birthDate`     | `YYYY-MM-DD`                                                                                                                                             | The registered date of birth of the individual                                                                                                                                                                                                                                                                        |
| `maritalStatus` | `{"coding": [{"system": "http://hl7.org/fhir/StructureDefinition/marital-status","code": "M"}],"text": "MARRIED"}`                                       | The `maritalStatus` again is set using standardised codes browsable on the url supplied.                                                                                                                                                                                                                              |
| `address`       | `[{"type": "PERMANENT", line: [], "district": "6885f574-eb70-46dd-ab89-acc9982bd63e","state": "cd5e34cb-abe0-4900-9509-28f378b8d8e8","country": "ZMB"}]` | The `address` type can be `PERMANENT` and `CURRENT` both or either may be required depending on civil registration legislation in the country. Address lines, districts and states can be set to [FHIR Location](https://www.hl7.org/fhir/location.html) ids (explained below) to ensure statistical standardisation. |

**Identifier parameters**

| Identifier                  | Value      |
| --------------------------- | ---------- |
| `PASSPORT`                  | `PASSPORT` |
| `NATIONAL_ID`               | `PASSPORT` |
| `DRIVING_LICENSE`           | `PASSPORT` |
| `BIRTH_REGISTRATION_NUMBER` | `PASSPORT` |
| `DEATH_REGISTRATION_NUMBER` | `PASSPORT` |
| `REFUGEE_NUMBER`            | `PASSPORT` |
| `ALIEN_NUMBER`              | `PASSPORT` |
| `OTHER`                     | `PASSPORT` |
| `SOCIAL_SECURITY_NO`        | `PASSPORT` |

### Requesting the FHIR Task for a birth event contianing the Birth Registration Number

The FHIR Task [FHIR Bundle](https://www.hl7.org/fhir/bundle.html) contains valuable audit information regarding the event. It contains the generated **Birth Registration Number** from the event which is later saved into the Patient's identifiers.

**URL**

To request the FHIR Task [FHIR Bundle](https://www.hl7.org/fhir/bundle.html) associated with the event use the Composition `id`:

```
http://localhost:3447/fhir/Task?focus=Composition/bab755e0-7bbd-4d90-b155-352ffa283467
```

**Request headers**

```
Content-Type: application/json
Authorization: Bearer <token>
```

Multiple FHIR task Resources are returned in a [FHIR Bundle](https://www.hl7.org/fhir/bundle.html) containing an `entry` array.

**Task payload**

```
{
  "resourceType": "Bundle",
  "id": "f249714e-006a-49ca-82d4-5ff4e4dbbd79",
  "meta": { "lastUpdated": "2020-07-04T11:32:45.914+00:00" },
  "type": "searchset",
  "total": 1,
  "link": [
    {
      "relation": "self",
      "url": "http://localhost:3447/fhir/Task?focus=Composition/bab755e0-7bbd-4d90-b155-352ffa283467"
    }
  ],
  "entry": [
    {
      "fullUrl": "http://localhost:3447/fhir/Task/b4ff04b3-7ba2-4d8f-8c8b-757f7153eb11/_history/eb02643d-f3e2-44c8-a295-c0727764a5ce",
      "resource": {
        "resourceType": "Task",
        "status": "requested",
        "code": {
          "coding": [
            { "system": "http://opencrvs.org/specs/types", "code": "BIRTH" }
          ]
        },
        "focus": {
          "reference": "Composition/bab755e0-7bbd-4d90-b155-352ffa283467"
        },
        "id": "b4ff04b3-7ba2-4d8f-8c8b-757f7153eb11",
        "identifier": [
          {
            "system": "http://opencrvs.org/specs/id/draft-id",
            "value": "bab755e0-7bbd-4d90-b155-352ffa283467"
          },
          {
            "system": "http://opencrvs.org/specs/id/birth-tracking-id",
            "value": "BKXA8V2"
          },
          {
            "system": "http://opencrvs.org/specs/id/birth-registration-number",
            "value": "2020BKXA8V2"
          }
        ],
        "extension": [
          {
            "url": "http://opencrvs.org/specs/extension/contact-person",
            "valueString": "FATHER"
          },
          {
            "url": "http://opencrvs.org/specs/extension/contact-relationship",
            "valueString": ""
          },
          {
            "url": "http://opencrvs.org/specs/extension/contact-person-phone-number",
            "valueString": "+260734576343"
          },
          {
            "url": "http://opencrvs.org/specs/extension/timeLoggedMS",
            "valueInteger": 490
          },
          {
            "url": "http://opencrvs.org/specs/extension/regLastLocation",
            "valueReference": {
              "reference": "Location/43f37076-bf0e-46c6-97cb-4c2bd12dbdac"
            }
          },
          {
            "url": "http://opencrvs.org/specs/extension/regLastOffice",
            "valueReference": {
              "reference": "Location/531e9275-40e4-4ab5-a12c-6fa74d7b5b61"
            }
          },
          {
            "url": "http://opencrvs.org/specs/extension/regLastUser",
            "valueReference": {
              "reference": "Practitioner/23919090-f59c-4185-b256-69faf8b519d5"
            }
          }
        ],
        "lastModified": "2020-07-04T10:15:03.225Z",
        "businessStatus": {
          "coding": [
            {
              "system": "http://opencrvs.org/specs/reg-status",
              "code": "REGISTERED"
            }
          ]
        },
        "meta": {
          "lastUpdated": "2020-07-04T10:15:03.420+00:00",
          "versionId": "eb02643d-f3e2-44c8-a295-c0727764a5ce"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Task/b4ff04b3-7ba2-4d8f-8c8b-757f7153eb11"
      }
    }
  ]
}
```

**Key bundle entries**

| Entry            | Sample value                                                                                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `identifier`     | `[{"system": "http://opencrvs.org/specs/id/birth-registration-number","value": "2020BKXA8V2"}]`                  | The Birth Registration Number.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `extension`      | `[{"url": "http://opencrvs.org/specs/extension/contact-person-phone-number","valueString": "+260734576343"} ...` | The extensions contain contact details for the event. `regLastLocation` contains a [FHIR Location](https://www.hl7.org/fhir/location.html) reference for the administrative area where the birth was registered. `regLastOffice` contains a [FHIR Location](https://www.hl7.org/fhir/location.html) reference for the civil registration office where the birth was registered. `regLastUser` contains a FHIR Practitioner reference for the civil registration officer who registered the event. |
| `businessStatus` | `{"coding": [{"system": "http://opencrvs.org/specs/reg-status","code": "REGISTERED"}]}`                          | The `businessStatus` code will be either `REGISTERED` or `CERTIFIED` for a valid registration.                                                                                                                                                                                                                                                                                                                                                                                                    |

### Requesting the FHIR Observations for a birth event

A number of other configurable and unidentifiable data points can be captured for the event lifecycle, such as; who was present at the birth, what was the birth weight etc. For this kind of data, we use [FHIR Observations](https://www.hl7.org/fhir/observation.html).

**URL**

To request all the [Observations](https://www.hl7.org/fhir/observation.html) associated with the event use the `birth-encounter` resource reference:

```
GET http://openhim-core:5001/fhir/Observation?encounter=Encounter/af7be33b-3e0c-4012-b894-c32d4bcc5100
```

**Request headers**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Observations payload**

Multiple FHIR Resources are returned in a [FHIR Bundle](https://www.hl7.org/fhir/bundle.html) containing an `entry` array.

```
{
  "resourceType": "Bundle",
  "id": "e4fad8cb-12b6-4deb-be72-cc8075c0692e",
  "meta": { "lastUpdated": "2020-07-04T10:56:50.398+00:00" },
  "type": "searchset",
  "total": 4,
  "link": [
    {
      "relation": "self",
      "url": "http://localhost:3447/fhir/Observation?encounter=Encounter/af7be33b-3e0c-4012-b894-c32d4bcc5100"
    }
  ],
  "entry": [
    {
      "fullUrl": "http://localhost:3447/fhir/Observation/fdbaa049-8da6-44b2-9780-e02ed70b3e73/_history/4db373f9-9b50-4c95-bfdf-f0009ef89bb5",
      "resource": {
        "resourceType": "Observation",
        "status": "final",
        "context": {
          "reference": "Encounter/af7be33b-3e0c-4012-b894-c32d4bcc5100"
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://hl7.org/fhir/observation-category",
                "code": "procedure",
                "display": "Procedure"
              }
            ]
          }
        ],
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "73764-3",
              "display": "Birth attendant title"
            }
          ]
        },
        "id": "fdbaa049-8da6-44b2-9780-e02ed70b3e73",
        "valueString": "PHYSICIAN",
        "meta": {
          "lastUpdated": "2020-07-04T10:15:03.246+00:00",
          "versionId": "4db373f9-9b50-4c95-bfdf-f0009ef89bb5"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Observation/fdbaa049-8da6-44b2-9780-e02ed70b3e73"
      }
    },
    {
      "fullUrl": "http://localhost:3447/fhir/Observation/fc2f1c18-cfee-44ec-bbb6-d3d1463a950c/_history/6e8b6116-c411-478a-a07b-24d67eefbef4",
      "resource": {
        "resourceType": "Observation",
        "status": "final",
        "context": {
          "reference": "Encounter/af7be33b-3e0c-4012-b894-c32d4bcc5100"
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://hl7.org/fhir/observation-category",
                "code": "vital-signs",
                "display": "Vital Signs"
              }
            ]
          }
        ],
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "3141-9",
              "display": "Body weight Measured"
            }
          ]
        },
        "id": "fc2f1c18-cfee-44ec-bbb6-d3d1463a950c",
        "valueQuantity": {
          "value": 1.5,
          "unit": "kg",
          "system": "http://unitsofmeasure.org",
          "code": "kg"
        },
        "meta": {
          "lastUpdated": "2020-07-04T10:15:03.250+00:00",
          "versionId": "6e8b6116-c411-478a-a07b-24d67eefbef4"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Observation/fc2f1c18-cfee-44ec-bbb6-d3d1463a950c"
      }
    },
    {
      "fullUrl": "http://localhost:3447/fhir/Observation/3f7bce83-2993-4741-a436-7b99035ab427/_history/87767bc5-d70a-415b-9435-0f744a1de592",
      "resource": {
        "resourceType": "Observation",
        "status": "final",
        "context": {
          "reference": "Encounter/af7be33b-3e0c-4012-b894-c32d4bcc5100"
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://hl7.org/fhir/observation-category",
                "code": "procedure",
                "display": "Procedure"
              }
            ]
          }
        ],
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "57722-1",
              "display": "Birth plurality of Pregnancy"
            }
          ]
        },
        "id": "3f7bce83-2993-4741-a436-7b99035ab427",
        "valueQuantity": { "value": "SINGLE" },
        "meta": {
          "lastUpdated": "2020-07-04T10:15:03.254+00:00",
          "versionId": "87767bc5-d70a-415b-9435-0f744a1de592"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Observation/3f7bce83-2993-4741-a436-7b99035ab427"
      }
    },
    {
      "fullUrl": "http://localhost:3447/fhir/Observation/3d4abe32-d7dc-42c8-93ab-54186a68088a/_history/47ac808e-3cde-4b80-9b5b-71ad50f89ac3",
      "resource": {
        "resourceType": "Observation",
        "status": "final",
        "context": {
          "reference": "Encounter/af7be33b-3e0c-4012-b894-c32d4bcc5100"
        },
        "category": [
          {
            "coding": [
              {
                "system": "http://hl7.org/fhir/observation-category",
                "code": "procedure",
                "display": "Procedure"
              }
            ]
          }
        ],
        "code": {
          "coding": [
            {
              "system": "http://loinc.org",
              "code": "present-at-birth-reg",
              "display": "Present at birth registration"
            }
          ]
        },
        "id": "3d4abe32-d7dc-42c8-93ab-54186a68088a",
        "valueString": "BOTH_PARENTS",
        "meta": {
          "lastUpdated": "2020-07-04T10:15:03.257+00:00",
          "versionId": "47ac808e-3cde-4b80-9b5b-71ad50f89ac3"
        }
      },
      "request": {
        "method": "PUT",
        "url": "Observation/3d4abe32-d7dc-42c8-93ab-54186a68088a"
      }
    }
  ]
}
```

### Getting the location data for FHIR Locations

You will find many [FHIR Location](https://www.hl7.org/fhir/location.html) ids throughout the resources, such as place of birth, patient addresses, places of registration etc. These return [FHIR Location](https://www.hl7.org/fhir/location.html) resources that refer either to either facilities with address and contact details, or administrative areas such as districts and states. [FHIR Locations](https://www.hl7.org/fhir/location.html) also contian multiple identifiers including an ID that should be defined by your government statistical department and aligns across all systems.

In OpenCRVS we extend [FHIR Locations](https://www.hl7.org/fhir/location.html) to include other statistical data related to calculating civil registration performance estimates such as the crude birth rate & populations for a location by year.

[FHIR Locations](https://www.hl7.org/fhir/location.html) are saved into OpenCRVS during configuration.

**URL**

```
GET http://openhim-core:5001/fhir/Location/43f37076-bf0e-46c6-97cb-4c2bd12dbdac
```

**Request headers**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Administrative area location payload, such as a state or district**

```
{
  "resourceType": "Location",
  "identifier": [
    {
      "system": "http://opencrvs.org/specs/id/statistical-code",
      "value": "ADMIN_STRUCTURE_QTtxiWj8ONP"
    },
    {
      "system": "http://opencrvs.org/specs/id/jurisdiction-type",
      "value": "DISTRICT"
    }
  ],
  "name": "Chembe District",
  "alias": ["Chembe District"],
  "description": "QTtxiWj8ONP",
  "status": "active",
  "mode": "instance",
  "partOf": { "reference": "Location/cd5e34cb-abe0-4900-9509-28f378b8d8e8" },
  "type": {
    "coding": [
      {
        "system": "http://opencrvs.org/specs/location-type",
        "code": "ADMIN_STRUCTURE"
      }
    ]
  },
  "physicalType": { "coding": [{ "code": "jdn", "display": "Jurisdiction" }] },
  "extension": [
    {
      "url": "http://hl7.org/fhir/StructureDefinition/location-boundary-geojson",
      "valueAttachment": {
        "contentType": "application/geo+json",
        "data": "<base64>"
      }
    },
    {
      url: 'http://opencrvs.org/specs/id/statistics-male-populations',
      valueString:
        '[{"2007":"1292568"},{"2008":"1250993"},{"2009":"1246376"},{"2010":"1279752"},{"2011":"1293470"},{"2012":"1291684"},{"2013":"1756173"},{"2014":"1788473"},{"2015":"1167891"},{"2016":"1225971"},{"2017":"1159078"}]'
    },
    {
      url: 'http://opencrvs.org/specs/id/statistics-female-populations',
      valueString:
        '[{"2007":"1261767"},{"2008":"1221096"},{"2009":"1214677"},{"2010":"1240638"},{"2011":"1257481"},{"2012":"1241730"},{"2013":"1724403"},{"2014":"1758485"},{"2015":"1151860"},{"2016":"1228886"},{"2017":"1168980"}]'
    },
    {
      url: 'http://opencrvs.org/specs/id/statistics-total-populations',
      valueString:
        '[{"2007":"2554927"},{"2008":"2472586"},{"2009":"2461610"},{"2010":"2520874"},{"2011":"2551523"},{"2012":"2533688"},{"2013":"3480570"},{"2014":"3546954"},{"2015":"2319748"},{"2016":"2454857"},{"2017":"2328051"}]'
    },
    {
      url: 'http://opencrvs.org/specs/id/statistics-male-female-ratios',
      valueString:
        '[{"2007":"102.4"},{"2008":"102.4"},{"2009":"102.6"},{"2010":"103.2"},{"2011":"102.9"},{"2012":"104"},{"2013":"101.8"},{"2014":"101.7"},{"2015":"101.4"},{"2016":"99.8"},{"2017":"99.2"}]'
    },
    {
      url: 'http://opencrvs.org/specs/id/statistics-crude-birth-rates',
      valueString:
        '[{"2007":"19.6"},{"2008":"19.4"},{"2009":"19"},{"2010":"18.5"},{"2011":"15.8"},{"2012":"20"},{"2013":"20.1"},{"2014":"18.7"},{"2015":"23.2"},{"2016":"19.1"},{"2017":"22.3"}]'
    }
  ],
  "meta": {
    "lastUpdated": "2020-06-15T11:42:03.726+00:00",
    "versionId": "688b4a56-b8a6-47c1-b635-91a501a58e39"
  },
  "id": "6885f574-eb70-46dd-ab89-acc9982bd63e"
}
```

**Facility location payload such as a civil registration office or hospital**

```
{
  "resourceType": "Location",
  "identifier": [
    {
      "system": "http://opencrvs.org/specs/id/internal-id",
      "value": "CRVS_OFFICE_o8B4Up9xxJI"
    }
  ],
  "name": "Lusaka DNRPC District Office",
  "alias": ["Lusaka DNRPC District Office"],
  "status": "active",
  "mode": "instance",
  "partOf": { "reference": "Location/43f37076-bf0e-46c6-97cb-4c2bd12dbdac" },
  "type": {
    "coding": [
      {
        "system": "http://opencrvs.org/specs/location-type",
        "code": "CRVS_OFFICE"
      }
    ]
  },
  "physicalType": { "coding": [{ "code": "bu", "display": "Building" }] },
  "telecom": [],
  "address": {
    "line": [],
    "district": "Lusaka District",
    "state": "Lusaka Province"
  },
  "meta": {
    "lastUpdated": "2020-06-15T11:42:09.114+00:00",
    "versionId": "0e9a6805-fdf7-453d-9473-d1eeb2d56ac0"
  },
  "id": "531e9275-40e4-4ab5-a12c-6fa74d7b5b61"
}
```

\
