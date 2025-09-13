CREATE MATERIALIZED VIEW reporting."105_01_conditions" AS
select
  to_char(diagnosised_date, 'YYYYMM') as report_month,
  disease_id,
  disease,
  count(case when age(diagnosised_date, birth_date) < interval '29 days' and gender = 'Male' then 1 end) as "0-28d Male",
  count(case when age(diagnosised_date, birth_date) < interval '29 days' and gender = 'Female' then 1 end) as "0-28d Female",
  count(case when age(diagnosised_date, birth_date) >= interval '29 days' and age(diagnosised_date, birth_date) < interval '5 years' and gender = 'Male' then 1 end) as "29d-4y Male",
  count(case when age(diagnosised_date, birth_date) >= interval '29 days' and age(diagnosised_date, birth_date) < interval '5 years' and gender = 'Female' then 1 end) as "29d-4y Female",
  count(case when date_part('year', age(diagnosised_date, birth_date)) between 5 and 9 and gender = 'Male' then 1 end) as "5-9y Male",
  count(case when date_part('year', age(diagnosised_date, birth_date)) between 5 and 9 and gender = 'Female' then 1 end) as "5-9y Female",
  count(case when date_part('year', age(diagnosised_date, birth_date)) between 10 and 19 and gender = 'Male' then 1 end) as "10-19y Male",
  count(case when date_part('year', age(diagnosised_date, birth_date)) between 10 and 19 and gender = 'Female' then 1 end) as "10-19y Female",
  count(case when date_part('year', age(diagnosised_date, birth_date)) >= 20 and gender = 'Male' then 1 end) as "20y+ Male",
  count(case when date_part('year', age(diagnosised_date, birth_date)) >= 20 and gender = 'Female' then 1 end) as "20y+ Female"
from reporting.patient_conditions
where origin = 'op'
group by to_char(diagnosised_date, 'YYYYMM'), disease_id, disease
order by report_month desc, disease_id;
