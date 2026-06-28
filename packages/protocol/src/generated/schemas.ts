/* eslint-disable */
// Generated from packages/protocol/schemas. Do not edit by hand.

export const MypaytagIntentSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/mypaytag-intent.schema.json",
  "title": "MyPayTagIntent",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "id",
    "schema",
    "status",
    "modality",
    "recipient",
    "selectedRoute",
    "amount",
    "expiresAt",
    "singleUse",
    "paymentInstruction",
    "references"
  ],
  "properties": {
    "id": {
      "type": "string",
      "minLength": 1
    },
    "schema": {
      "const": "mypaytag.intent.v1"
    },
    "status": {
      "const": "ready"
    },
    "modality": {
      "const": "provider_intent"
    },
    "recipient": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "identifierType",
        "identifierHash"
      ],
      "properties": {
        "identifierType": {
          "const": "paytag"
        },
        "identifierHash": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "selectedRoute": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "payToDappId",
        "chain",
        "network",
        "asset"
      ],
      "properties": {
        "payToDappId": {
          "type": "string",
          "minLength": 1
        },
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "amount": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "value",
        "currency"
      ],
      "properties": {
        "value": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "currency": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "expiresAt": {
      "type": "string",
      "format": "date-time"
    },
    "singleUse": {
      "const": true
    },
    "paymentInstruction": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "provider",
        "payload"
      ],
      "properties": {
        "type": {
          "const": "provider_json"
        },
        "provider": {
          "type": "string",
          "minLength": 1
        },
        "payload": {
          "$ref": "#/$defs/providerPayload"
        }
      }
    },
    "references": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "resolverReference",
        "providerReference",
        "payingDappReference"
      ],
      "properties": {
        "resolverReference": {
          "type": "string",
          "minLength": 1
        },
        "providerReference": {
          "type": "string",
          "minLength": 1
        },
        "payingDappReference": {
          "type": "string",
          "minLength": 1
        }
      }
    }
  },
  "$defs": {
    "providerPayload": {
      "type": "object",
      "additionalProperties": true,
      "required": [
        "providerIntentId",
        "chain",
        "network",
        "asset",
        "destination",
        "amount",
        "reference",
        "expiresAt"
      ],
      "not": {
        "anyOf": [
          {
            "required": [
              "recipientAddress"
            ]
          },
          {
            "required": [
              "address"
            ]
          },
          {
            "required": [
              "account"
            ]
          }
        ]
      },
      "properties": {
        "providerIntentId": {
          "type": "string",
          "minLength": 1
        },
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        },
        "destination": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "kind",
            "recipientAddress"
          ],
          "properties": {
            "kind": {
              "const": "blockchain_address"
            },
            "recipientAddress": {
              "type": "string",
              "minLength": 1
            }
          }
        },
        "amount": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "reference": {
          "type": "string",
          "minLength": 1
        },
        "expiresAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  }
} as const;

export const NotificationEventSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/notification-event.schema.json",
  "title": "NotificationEvent",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "eventType",
    "schema",
    "recipient",
    "amount",
    "references",
    "action"
  ],
  "properties": {
    "eventType": {
      "const": "payment_intent_created"
    },
    "schema": {
      "const": "mypaytag.notification.v1"
    },
    "recipient": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "identifierType",
        "maskedDisplay"
      ],
      "properties": {
        "identifierType": {
          "const": "paytag"
        },
        "maskedDisplay": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "amount": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "value",
        "currency"
      ],
      "properties": {
        "value": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "currency": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "references": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "resolverReference",
        "providerReference",
        "payingDappReference"
      ],
      "properties": {
        "resolverReference": {
          "type": "string",
          "minLength": 1
        },
        "providerReference": {
          "type": "string",
          "minLength": 1
        },
        "payingDappReference": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "action": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type"
      ],
      "properties": {
        "type": {
          "const": "none"
        }
      }
    }
  }
} as const;

export const ProviderCallbackRequestSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/provider-callback-request.schema.json",
  "title": "ProviderCallbackRequest",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "resolverRequestId",
    "recipient",
    "payingDappId",
    "selectedPath",
    "amount",
    "purpose",
    "expiresAt"
  ],
  "properties": {
    "resolverRequestId": {
      "type": "string",
      "minLength": 1
    },
    "recipient": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "identifierType",
        "paytagReference"
      ],
      "properties": {
        "identifierType": {
          "const": "paytag"
        },
        "paytagReference": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "payingDappId": {
      "type": "string",
      "minLength": 1
    },
    "selectedPath": {
      "$ref": "#/$defs/path"
    },
    "amount": {
      "$ref": "#/$defs/amount"
    },
    "purpose": {
      "type": "string",
      "minLength": 1
    },
    "expiresAt": {
      "type": "string",
      "format": "date-time"
    }
  },
  "$defs": {
    "path": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "chain",
        "network",
        "asset"
      ],
      "properties": {
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "amount": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "value",
        "currency"
      ],
      "properties": {
        "value": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "currency": {
          "type": "string",
          "minLength": 1
        }
      }
    }
  }
} as const;

export const ProviderResponseSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/provider-response.schema.json",
  "title": "ProviderResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "providerIntentId",
    "status",
    "paymentInstruction"
  ],
  "properties": {
    "providerIntentId": {
      "type": "string",
      "minLength": 1
    },
    "status": {
      "const": "ready"
    },
    "paymentInstruction": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "provider",
        "payload"
      ],
      "properties": {
        "type": {
          "const": "provider_json"
        },
        "provider": {
          "type": "string",
          "minLength": 1
        },
        "payload": {
          "$ref": "#/$defs/providerPayload"
        }
      }
    }
  },
  "$defs": {
    "providerPayload": {
      "type": "object",
      "additionalProperties": true,
      "required": [
        "providerIntentId",
        "chain",
        "network",
        "asset",
        "destination",
        "amount",
        "reference",
        "expiresAt"
      ],
      "not": {
        "anyOf": [
          {
            "required": [
              "recipientAddress"
            ]
          },
          {
            "required": [
              "address"
            ]
          },
          {
            "required": [
              "account"
            ]
          }
        ]
      },
      "properties": {
        "providerIntentId": {
          "type": "string",
          "minLength": 1
        },
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        },
        "destination": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "kind",
            "recipientAddress"
          ],
          "properties": {
            "kind": {
              "const": "blockchain_address"
            },
            "recipientAddress": {
              "type": "string",
              "minLength": 1
            }
          }
        },
        "amount": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "reference": {
          "type": "string",
          "minLength": 1
        },
        "expiresAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  }
} as const;

export const ResolveRequestSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/resolve-request.schema.json",
  "title": "ResolveRequest",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "recipient",
    "supportedPaths",
    "amount",
    "purpose",
    "intentMode",
    "payingDappReference"
  ],
  "properties": {
    "recipient": {
      "$ref": "#/$defs/recipient"
    },
    "supportedPaths": {
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "#/$defs/path"
      }
    },
    "amount": {
      "$ref": "#/$defs/amount"
    },
    "purpose": {
      "type": "string",
      "minLength": 1
    },
    "intentMode": {
      "const": "one_time"
    },
    "payingDappReference": {
      "type": "string",
      "minLength": 1
    }
  },
  "$defs": {
    "recipient": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "identifierType",
        "identifier"
      ],
      "properties": {
        "identifierType": {
          "const": "paytag"
        },
        "identifier": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "path": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "chain",
        "network",
        "asset"
      ],
      "properties": {
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "amount": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "value",
        "currency"
      ],
      "properties": {
        "value": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "currency": {
          "type": "string",
          "minLength": 1
        }
      }
    }
  }
} as const;

export const ResolveResponseSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/resolve-response.schema.json",
  "title": "ResolveResponse",
  "oneOf": [
    {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "intent"
      ],
      "properties": {
        "status": {
          "const": "resolved"
        },
        "intent": {
          "$ref": "#/$defs/intent"
        }
      }
    },
    {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "action"
      ],
      "properties": {
        "status": {
          "const": "user_action_required"
        },
        "action": {
          "$ref": "#/$defs/action"
        }
      }
    },
    {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status"
      ],
      "properties": {
        "status": {
          "enum": [
            "no_route",
            "authorization_required",
            "unsupported_path",
            "provider_unavailable",
            "provider_error",
            "expired_authorization",
            "revoked_authorization",
            "invalid_identifier",
            "invalid_request"
          ]
        }
      }
    }
  ],
  "$defs": {
    "action": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "url",
        "expiresAt"
      ],
      "properties": {
        "type": {
          "const": "route_selection"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "expiresAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "intent": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "schema",
        "status",
        "modality",
        "recipient",
        "selectedRoute",
        "amount",
        "expiresAt",
        "singleUse",
        "paymentInstruction",
        "references"
      ],
      "properties": {
        "id": {
          "type": "string",
          "minLength": 1
        },
        "schema": {
          "const": "mypaytag.intent.v1"
        },
        "status": {
          "const": "ready"
        },
        "modality": {
          "const": "provider_intent"
        },
        "recipient": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "identifierType",
            "identifierHash"
          ],
          "properties": {
            "identifierType": {
              "const": "paytag"
            },
            "identifierHash": {
              "type": "string",
              "minLength": 1
            }
          }
        },
        "selectedRoute": {
          "$ref": "#/$defs/selectedRoute"
        },
        "amount": {
          "$ref": "#/$defs/amount"
        },
        "expiresAt": {
          "type": "string",
          "format": "date-time"
        },
        "singleUse": {
          "const": true
        },
        "paymentInstruction": {
          "$ref": "#/$defs/paymentInstruction"
        },
        "references": {
          "$ref": "#/$defs/references"
        }
      }
    },
    "selectedRoute": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "payToDappId",
        "chain",
        "network",
        "asset"
      ],
      "properties": {
        "payToDappId": {
          "type": "string",
          "minLength": 1
        },
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "amount": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "value",
        "currency"
      ],
      "properties": {
        "value": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "currency": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "paymentInstruction": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "provider",
        "payload"
      ],
      "properties": {
        "type": {
          "const": "provider_json"
        },
        "provider": {
          "type": "string",
          "minLength": 1
        },
        "payload": {
          "$ref": "#/$defs/providerPayload"
        }
      }
    },
    "providerPayload": {
      "type": "object",
      "additionalProperties": true,
      "required": [
        "providerIntentId",
        "chain",
        "network",
        "asset",
        "destination",
        "amount",
        "reference",
        "expiresAt"
      ],
      "not": {
        "anyOf": [
          {
            "required": [
              "recipientAddress"
            ]
          },
          {
            "required": [
              "address"
            ]
          },
          {
            "required": [
              "account"
            ]
          }
        ]
      },
      "properties": {
        "providerIntentId": {
          "type": "string",
          "minLength": 1
        },
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        },
        "destination": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "kind",
            "recipientAddress"
          ],
          "properties": {
            "kind": {
              "const": "blockchain_address"
            },
            "recipientAddress": {
              "type": "string",
              "minLength": 1
            }
          }
        },
        "amount": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "reference": {
          "type": "string",
          "minLength": 1
        },
        "expiresAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    },
    "references": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "resolverReference",
        "providerReference",
        "payingDappReference"
      ],
      "properties": {
        "resolverReference": {
          "type": "string",
          "minLength": 1
        },
        "providerReference": {
          "type": "string",
          "minLength": 1
        },
        "payingDappReference": {
          "type": "string",
          "minLength": 1
        }
      }
    }
  }
} as const;

export const RouteQuotePreviewSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/route-quote-preview.schema.json",
  "title": "RouteQuotePreview",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "id",
    "method",
    "methodLabel",
    "send",
    "receive",
    "fees",
    "expiresAt",
    "resolverReference"
  ],
  "properties": {
    "id": {
      "type": "string",
      "minLength": 1
    },
    "method": {
      "enum": [
        "direct_transfer",
        "provider_exchange",
        "provider_intent",
        "bridge",
        "cross_chain_intent"
      ]
    },
    "methodLabel": {
      "type": "string",
      "minLength": 1
    },
    "send": {
      "$ref": "#/$defs/routeAmount"
    },
    "receive": {
      "$ref": "#/$defs/routeAmount"
    },
    "fees": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/fee"
      }
    },
    "expiresAt": {
      "type": "string",
      "format": "date-time"
    },
    "resolverReference": {
      "type": "string",
      "minLength": 1
    }
  },
  "$defs": {
    "routeAmount": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "chain",
        "network",
        "asset",
        "amount"
      ],
      "properties": {
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        },
        "amount": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        }
      }
    },
    "fee": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "label",
        "amount",
        "asset",
        "chargedTo",
        "source"
      ],
      "properties": {
        "label": {
          "type": "string",
          "minLength": 1
        },
        "amount": {
          "type": "string",
          "pattern": "^[0-9]+(\\.[0-9]+)?$"
        },
        "asset": {
          "type": "string",
          "minLength": 1
        },
        "chargedTo": {
          "const": "sender"
        },
        "source": {
          "enum": [
            "payor_app",
            "provider",
            "resolver"
          ]
        }
      }
    }
  }
} as const;

export const RouteRegistrationRequestSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/route-registration-request.schema.json",
  "title": "RouteRegistrationRequest",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "recipient",
    "payToDappId",
    "supportedRoutes",
    "authorizationToken"
  ],
  "properties": {
    "recipient": {
      "$ref": "#/$defs/recipient"
    },
    "payToDappId": {
      "type": "string",
      "minLength": 1
    },
    "supportedRoutes": {
      "type": "array",
      "minItems": 1,
      "items": {
        "$ref": "#/$defs/route"
      }
    },
    "authorizationToken": {
      "type": "string",
      "minLength": 1
    }
  },
  "not": {
    "anyOf": [
      {
        "required": [
          "account"
        ]
      },
      {
        "required": [
          "address"
        ]
      },
      {
        "required": [
          "recipientAddress"
        ]
      },
      {
        "required": [
          "memo"
        ]
      },
      {
        "required": [
          "paymentInstruction"
        ]
      },
      {
        "required": [
          "paymentLink"
        ]
      }
    ]
  },
  "$defs": {
    "recipient": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "identifierType",
        "identifier"
      ],
      "properties": {
        "identifierType": {
          "const": "paytag"
        },
        "identifier": {
          "type": "string",
          "minLength": 1
        }
      }
    },
    "route": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "chain",
        "network",
        "asset"
      ],
      "properties": {
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        }
      }
    }
  }
} as const;

export const RouteRegistrationResponseSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/route-registration-response.schema.json",
  "title": "RouteRegistrationResponse",
  "oneOf": [
    {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "routes"
      ],
      "properties": {
        "status": {
          "const": "resolved"
        },
        "routes": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/routeRecord"
          }
        }
      }
    },
    {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "status",
        "action"
      ],
      "properties": {
        "status": {
          "const": "user_action_required"
        },
        "action": {
          "$ref": "#/$defs/action"
        }
      }
    }
  ],
  "$defs": {
    "routeRecord": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "id",
        "payToDappId",
        "chain",
        "network",
        "asset",
        "state"
      ],
      "properties": {
        "id": {
          "type": "string",
          "minLength": 1
        },
        "payToDappId": {
          "type": "string",
          "minLength": 1
        },
        "chain": {
          "type": "string",
          "minLength": 1
        },
        "network": {
          "type": "string",
          "minLength": 1
        },
        "asset": {
          "type": "string",
          "minLength": 1
        },
        "state": {
          "enum": [
            "active",
            "disabled",
            "revoked"
          ]
        }
      }
    },
    "action": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "type",
        "url",
        "expiresAt"
      ],
      "properties": {
        "type": {
          "const": "route_selection"
        },
        "url": {
          "type": "string",
          "format": "uri"
        },
        "expiresAt": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  }
} as const;

export const StatusSchema = {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://schemas.mypaytag.com/status.schema.json",
  "title": "MyPayTagStatus",
  "type": "string",
  "enum": [
    "resolved",
    "no_route",
    "user_action_required",
    "authorization_required",
    "unsupported_path",
    "provider_unavailable",
    "provider_error",
    "expired_authorization",
    "revoked_authorization",
    "invalid_identifier",
    "invalid_request"
  ]
} as const;

export const protocolSchemas = {
  "mypaytag-intent": MypaytagIntentSchema,
  "notification-event": NotificationEventSchema,
  "provider-callback-request": ProviderCallbackRequestSchema,
  "provider-response": ProviderResponseSchema,
  "resolve-request": ResolveRequestSchema,
  "resolve-response": ResolveResponseSchema,
  "route-quote-preview": RouteQuotePreviewSchema,
  "route-registration-request": RouteRegistrationRequestSchema,
  "route-registration-response": RouteRegistrationResponseSchema,
  "status": StatusSchema,
} as const;
