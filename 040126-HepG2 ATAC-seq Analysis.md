# ENCODE HepG2 ATAC-seq Analysis

## Aim

Analysis our HepG2 ATAC-seq data (2 replicates)

Compare with 2 published ENCODE HepG2 datasets

## Datasets

https://www.encodeproject.org/experiments/ENCSR291GJU/

https://www.encodeproject.org/experiments/ENCSR042AWH/

|                       |                         ENCSR291GJU                          |                         ENCSR042AWH                          |
| :-------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| Biological Replicates |                              3                               |                              2                               |
|  Conservative Peaks   |                              /                               | [ENCFF314RIW](https://www.encodeproject.org/files/ENCFF314RIW/) |
|     Optimal Peaks     | [ENCFF935GLR](https://www.encodeproject.org/files/ENCFF935GLR/) |                              /                               |



## Install ENCODE ATAC pipeline

### Login with terminal

```bash
ssh xli51@bridges2.psc.edu
cd /ocean/projects/bio200034p/xli51
```

### Environment

xinyi_ATAC

```bash
(base) [xli51@bridges2-login014 ATAC-seq]$ conda create -n xinyi_ATAC python=3.11 -y
```

### Install and init caper

```bash
pip install caper
caper init slurm
(xinyi_ATAC) [xli51@bridges2-login014 ATAC-seq]$ vim default.conf
(xinyi_ATAC) [xli51@bridges2-login014 ATAC-seq]$ cat default.conf
slurm-partition = RM-shared
```

### Install java

```bash
conda install openjdk=11.0.13
```

### Download ENCODE pipeline for ATAC-seq analysis

```bash
/ocean/projects/bio200034p/xli51/ATAC-seq/atac-seq-pipeline
```

### Run sample json from ENCODE

```bash
cd atac-seq-pipeline

INPUT_JSON="https://storage.googleapis.com/encode-pipeline-test-samples/encode-atac-seq-pipeline/ENCSR356KRQ_subsampled.json"

# on HPC, make sure that Caper's conf ~/.caper/default.conf is correctly configured to work with your HPC
# the following command will submit Caper as a leader job to SLURM with Singularity
$ caper hpc submit atac.wdl -i "${INPUT_JSON}" --singularity --leader-job-name ANY_GOOD_LEADER_JOB_NAME

# check job ID and status of your leader jobs
$ caper hpc list

# cancel the leader node to close all of its children jobs
# If you directly use cluster command like scancel or qdel then
# child jobs will not be terminated
$ caper hpc abort [JOB_ID]
```

## Datasets

### Download published datasets

Download "bed narrowPeak - conservative IDR thresholded peaks" for both published datasets

```bash
wget https://www.encodeproject.org/files/ENCFF314RIW/@@download/ENCFF314RIW.bed.gz
```

```bash
/ocean/projects/bio200034p/xli51/ATAC-seq/HepG2_ATAC-seq
```

```bash
gunzip ENCFF314RIW.bed.gz
gunzip ENCFF536RJV.bed.gz
```

https://genome.ucsc.edu/FAQ/FAQformat.html#format1

Use the **"conservative" peaks from the study with 2 replicates** and the **"optimal" peaks from the study with 3 replicates**. 

The reason is that we ideally want peaks reproducible across replicates, but, if there are > 2 replicates, I would rather use all of the data than dump a replicate.

Download optimal peaks [ENCFF935GLR ](https://www.encodeproject.org/files/ENCFF935GLR/)for ENCSR291GJU

```bash
wget https://www.encodeproject.org/files/ENCFF935GLR/@@download/ENCFF935GLR.bed.gz
```

## Run ENCODE pipeline

### HepG2_ATAC.json

```json
{
    "atac.pipeline_type": "atac",
    "atac.genome_tsv": "https://storage.googleapis.com/encode-pipeline-genome-data/genome_tsv/v4/hg38.tsv",
    "atac.fastqs_rep1_R1": ["/ocean/projects/bio200034p/mma3/Genwiz_deep_sequencing_01132026/HepG2-1_R1_001.fastq.gz"],
    "atac.fastqs_rep1_R2": ["/ocean/projects/bio200034p/mma3/Genwiz_deep_sequencing_01132026/HepG2-1_R2_001.fastq.gz"],
    "atac.fastqs_rep2_R1": ["/ocean/projects/bio200034p/mma3/Genwiz_deep_sequencing_01132026/HepG2-2_R1_001.fastq.gz"],
    "atac.fastqs_rep2_R2": ["/ocean/projects/bio200034p/mma3/Genwiz_deep_sequencing_01132026/HepG2-2_R2_001.fastq.gz"],
    "atac.paired_end" : true,
    "atac.auto_detect_adapter" : true,
    "atac.multimapping" : 0,
    "atac.dup_marker" : "picard",
    "atac.no_dup_removal" : false,
    "atac.enable_xcor" : false,
    "atac.enable_compare_to_roadmap" : true,
    "atac.enable_tss_enrich" : true,
    "atac.enable_gc_bias" : true,
    "atac.title" : "HepG2-ATAC",
    "atac.description" : "HepG2-ATAC"
}
```

### run_HepG2_ATAC.sh

```bash
#!/bin/bash
#SBATCH -p RM-shared
#SBATCH -t 72:00:00
#SBATCH --mem 1999M
#SBATCH -J HepG2_xinyili

#SBATCH --export=ALL

module load anaconda3
conda activate xinyi_ATAC

#echo commands to stdout
set -x

# move to working directory
# this job assumes:
# - all input data is stored in this directory
# - all output should be stored in this directory
# - please note that groupname should be replaced by your groupname
# - username should be replaced by your username
# - path-to-directory should be replaced by the path to your directory where the executable is

caper hpc submit /ocean/projects/bio200034p/xli51/ATAC-seq/atac-seq-pipeline/atac.wdl -i /ocean/projects/bio200034p/xli51/ATAC-seq/Kaplow_lab_HepG2_ATAC/HepG2_ATAC.json --singularity --leader-job-name HepG2-ATAC
```

### Track

```bash
squeue -u xli51
```

### croo: organize outputs

```bash
pip install croo

cd [your_working_folder]
find . -name metadata.json
# ./atac/d5db63ca-d996-4c45-99e6-16f27c39a69f/metadata.json

# croo [METADATA_JSON_FILE]
croo ./atac/d5db63ca-d996-4c45-99e6-16f27c39a69f/metadata.json
```

