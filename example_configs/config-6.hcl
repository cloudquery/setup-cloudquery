// Configuration AutoGenerated by CloudQuery CLI
cloudquery {
  provider "aws" {
    version = "latest"
  }

  connection {
    username = "postgres"
    password = "pass"
    host     = "localhost"
    port     = 5432
    database = "postgres"
    sslmode  = "disable"
  }
}

provider "aws" {
  configuration {
    aws_debug = false
  }
  resources = [
    "secretsmanager.secrets",
    "shield.attacks",
    "shield.protections",
    "shield.protections_groups",
    "shield.subscriptions",
    "sns.subscriptions",
    "sns.topics",
    "sqs.queues",
    "ssm.documents",
    "ssm.instances",
    "waf.rule_groups",
    "waf.rules",
    "waf.subscribed_rule_groups",
    "waf.web_acls",
    "wafregional.rate_based_rules",
    "wafregional.rule_groups",
    "wafregional.rules",
    "wafregional.web_acls",
    "wafv2.ipsets",
    "wafv2.managed_rule_groups",
    "wafv2.regex_pattern_sets",
    "wafv2.rule_groups",
    "wafv2.web_acls",
    "workspaces.directories",
    "workspaces.workspaces",
    "xray.encryption_config",
    "xray.groups",
    "xray.sampling_rules"
  ]
}

modules {
  drift "drift-example" {
    terraform {
      backend = "local"
      files   = ["/path/to.tfstate"]
    }
  }
}
